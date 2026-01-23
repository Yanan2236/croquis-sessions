import random
from pathlib import Path
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.core.files import File
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from faker import Faker

from croquis.models import Subject, CroquisSession, Drawing


class Command(BaseCommand):
    help = "Seed CroquisSession (+ optional Drawing) dummy data for an existing user and existing subjects."

    def add_arguments(self, parser):
        parser.add_argument("--email", type=str, required=True, help="Target user email")
        parser.add_argument("--sessions", type=int, default=30, help="Number of sessions to create")
        parser.add_argument("--attach-drawings", action="store_true", help="Attach drawings to created sessions")
        parser.add_argument("--max-drawings", type=int, default=5, help="Max drawings per session (when attach-drawings)")
        parser.add_argument("--seed-dir", type=str, default="media/seed_drawings", help="Seed images directory (relative to /app)")

    @transaction.atomic
    def handle(self, *args, **options):
        fake = Faker("ja_JP")

        email: str = options["email"]
        session_count: int = options["sessions"]
        attach_drawings: bool = bool(options["attach_drawings"])
        max_drawings: int = options["max_drawings"]
        seed_dir_opt: str = options["seed_dir"]

        # --- user ---
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"User not found: {email}"))
            return

        # --- subjects ---
        subjects = list(Subject.objects.filter(user=user))
        if not subjects:
            self.stderr.write(self.style.ERROR("No subjects found for this user. Create subjects first."))
            return

        # --- seed images ---
        image_paths: list[Path] = []
        seed_dir: Path | None = None

        if attach_drawings:
            seed_dir = Path(seed_dir_opt)
            if not seed_dir.is_absolute():
                seed_dir = Path.cwd() / seed_dir

            if not seed_dir.exists():
                self.stderr.write(self.style.ERROR(f"Seed image directory not found: {seed_dir}"))
                return

            for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
                image_paths.extend(seed_dir.glob(ext))

            if not image_paths:
                self.stderr.write(self.style.ERROR(f"No image files found in: {seed_dir}"))
                return

            if max_drawings < 1:
                self.stderr.write(self.style.ERROR("--max-drawings must be >= 1 when --attach-drawings"))
                return

        created_sessions = 0
        created_drawings = 0

        latest_by_subject: dict[int, CroquisSession] = {}

        now = timezone.now()

        for _ in range(session_count):
            subject = random.choice(subjects)

            # started_at
            days_ago = random.randint(0, 60)
            minutes_ago = random.randint(0, 24 * 60)
            started_at = now - timedelta(days=days_ago, minutes=minutes_ago)

            # セッション時間
            duration_minutes = random.randint(3, 45)
            ended_at = started_at + timedelta(minutes=duration_minutes)

            session = CroquisSession.objects.create(
                user=user,
                subject=subject,
                started_at=started_at,
                ended_at=ended_at,
                finalized_at=ended_at,
                intention=fake.sentence(nb_words=8),
                reflection=fake.sentence(nb_words=10),
                next_action=fake.sentence(nb_words=10),
                note=fake.text(max_nb_chars=120),
                is_public=False,
            )
            created_sessions += 1

            prev = latest_by_subject.get(subject.id)
            if prev is None or session.started_at > prev.started_at:
                latest_by_subject[subject.id] = session

            # --- drawings ---
            if attach_drawings:
                drawing_count = random.randint(1, min(max_drawings, len(image_paths)))
                picked = random.sample(image_paths, k=drawing_count)

                for order, img_path in enumerate(picked):
                    drawing = Drawing(session=session, order=order)
                    with img_path.open("rb") as f:
                        drawing.image_file.save(img_path.name, File(f), save=True)
                    created_drawings += 1

        for subject in subjects:
            latest = latest_by_subject.get(subject.id)
            if latest is not None:
                subject.latest_session = latest
                subject.save(update_fields=["latest_session", "updated_at"])

        if attach_drawings:
            self.stdout.write(self.style.SUCCESS(
                f"Done. sessions={created_sessions}, drawings={created_drawings}, images_pool={len(image_paths)}"
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                f"Done. sessions={created_sessions} (drawings skipped)"
            ))
