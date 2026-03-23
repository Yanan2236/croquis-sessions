from django.urls import path, include

from accounts.views.api.user import csrf
from accounts.views.api.auth import CustomPasswordResetView, SafeRegisterView
from accounts.views.web.password_reset_redirect import PasswordResetConfirmRedirectView

from django.urls import path, include
from dj_rest_auth.registration.views import VerifyEmailView, ResendEmailVerificationView

urlpatterns = [
    path('croquis/', include('croquis.urls.api')),
    path("accounts/", include("allauth.urls")),
    path('accounts/', include('accounts.urls.api')),

    path('auth/registration/', SafeRegisterView.as_view(), name='rest_register'),

    path(
        'auth/registration/verify-email/',
        VerifyEmailView.as_view(),
        name='rest_verify_email',
    ),
    path(
        'auth/registration/resend-email/',
        ResendEmailVerificationView.as_view(),
        name='rest_resend_email',
    ),

    path("auth/csrf/", csrf, name='csrf'),
    path("auth/password/reset/", CustomPasswordResetView.as_view(), name='password_reset'),
    path(
        "auth/password/reset/confirm/<uidb64>/<token>/",
        PasswordResetConfirmRedirectView.as_view(),
        name='password_reset_confirm',
    ),
    path('auth/', include('dj_rest_auth.urls')),
]