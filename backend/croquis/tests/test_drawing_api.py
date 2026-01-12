from io import BytesIO

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
from PIL import Image

import shutil
import tempfile
from django.test import override_settings

from croquis.models import Subject, CroquisSession, Drawing


class TempMediaMixin:
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls._temp_media = tempfile.mkdtemp()
        cls._override = override_settings(MEDIA_ROOT=cls._temp_media)
        cls._override.enable()

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, "_override"):
            cls._override.disable()
        if hasattr(cls, "_temp_media"):
            shutil.rmtree(cls._temp_media, ignore_errors=True)
        super().tearDownClass()


def make_png_upload(name: str = "test.png") -> SimpleUploadedFile:
    buf = BytesIO()
    Image.new("RGB", (10, 10)).save(buf, format="PNG")
    buf.seek(0)
    return SimpleUploadedFile(name, buf.read(), content_type="image/png")


class DrawingAPITest(TempMediaMixin, APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.client.force_authenticate(user=self.user)

    def _create_session(self) -> CroquisSession:
        subject = Subject.objects.create(user=self.user, name="anatomy")

        res = self.client.post(
            "/api/croquis/sessions/",
            {"subject": subject.id, "intention": "test"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED, getattr(res, "data", None))
        return CroquisSession.objects.get(id=res.data["id"])

    def _drawings_url(self, session_id: int) -> str:
        return f"/api/croquis/sessions/{session_id}/drawings/"

    def test_create_drawing(self):
        session = self._create_session()

        url = self._drawings_url(session.id)
        upload = make_png_upload()

        res = self.client.post(url, {"image_file": upload}, format="multipart")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED, getattr(res, "data", None))
        self.assertEqual(Drawing.objects.filter(session=session).count(), 1)

    def test_list_drawings(self):
        session = self._create_session()
        url = self._drawings_url(session.id)

        upload = make_png_upload()
        create_res = self.client.post(url, {"image_file": upload}, format="multipart")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED, getattr(create_res, "data", None))

        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK, getattr(res, "data", None))
        self.assertIsInstance(res.data, list)
        self.assertGreaterEqual(len(res.data), 1)

        first = res.data[0]
        self.assertIn("id", first)
        self.assertIn("image_url", first)

    def test_cannot_create_drawing_after_finish(self):
        session = self._create_session()
        session.ended_at = timezone.now()
        session.save()

        url = self._drawings_url(session.id)
        upload = make_png_upload()

        res = self.client.post(url, {"image_file": upload}, format="multipart")
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT, getattr(res, "data", None))
