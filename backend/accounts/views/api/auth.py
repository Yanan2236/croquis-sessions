from dj_rest_auth.views import PasswordResetView
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from dj_rest_auth.registration.views import RegisterView
from rest_framework.response import Response
from rest_framework import status
from allauth.account.models import EmailAddress
from allauth.account import app_settings as allauth_settings

from accounts.serializers.password_reset import ReactPasswordResetSerializer

User = get_user_model()

class CustomPasswordResetView(PasswordResetView):
    serializer_class = ReactPasswordResetSerializer

class SafeRegisterView(RegisterView):
    # NOTE: 現在は開発のため列挙耐性を無効化し、メール重複時はエラーを返している。
    # TODO: 公開前に存在有無に関わらず同じレスポンスを返す実装へ戻す。
    def create(self, request, *args, **kwargs):
        email = (request.data.get("email") or "").strip().lower()

        if email:
            verified = EmailAddress.objects.filter(
                email__iexact=email,
                verified=True,
            ).exists()

            if verified:
                raise ValidationError({
                    "email": ["このメールアドレスは既に登録されています。"]
                })

            unverified = (
                EmailAddress.objects
                .filter(email__iexact=email, verified=False)
                .select_related("user")
                .first()
            )

            if unverified:
                unverified.send_confirmation(request, signup=False)
                return Response(
                    {"detail": "確認メールを再送しました。"},
                    status=status.HTTP_200_OK,
                )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        if allauth_settings.EMAIL_VERIFICATION == allauth_settings.EmailVerificationMethod.MANDATORY:
            return Response(
                {
                    "detail": "確認メールを送信しました。",
                    "email_verification_required": True,
                },
                status=status.HTTP_201_CREATED,
                headers=headers,
            )

        data = getattr(serializer, "data", {})
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)