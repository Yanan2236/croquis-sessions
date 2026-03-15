from dj_rest_auth.views import PasswordResetView
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from dj_rest_auth.registration.views import RegisterView
from rest_framework.response import Response
from rest_framework import status
from allauth.account.models import EmailAddress

from accounts.serializers.password_reset import ReactPasswordResetSerializer

User = get_user_model()

class CustomPasswordResetView(PasswordResetView):
    serializer_class = ReactPasswordResetSerializer

class SafeRegisterView(RegisterView):
    # NOTE: 現在は開発のため列挙耐性を無効化し、メール重複時はエラーを返している。
    # TODO: 公開前に存在有無に関わらず同じレスポンスを返す実装へ戻す。
    def create(self, request, *args, **kwargs):
        email = (request.data.get("email") or "").strip().lower()

        if not email:
            return super().create(request, *args, **kwargs)

        verified = EmailAddress.objects.filter(
            email__iexact=email,
            verified=True,
        ).exists()

        if verified:
            raise ValidationError({
                "email": ["このメールアドレスは既に登録されています。"]
            })

        unverified = EmailAddress.objects.filter(
            email__iexact=email,
            verified=False,
        ).select_related("user").first()

        if unverified:
            unverified.send_confirmation(request, signup=False)
            return Response(
                {"detail": "確認メールを再送しました。"},
                status=status.HTTP_200_OK,
            )

        return super().create(request, *args, **kwargs)