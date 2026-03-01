from django.urls import path, include

from accounts.views.api.user import csrf
from accounts.views.api.auth import CustomPasswordResetView
from accounts.views.web.password_reset_redirect import PasswordResetConfirmRedirectView

urlpatterns = [
    path('croquis/', include('croquis.urls.api')),
    path('accounts/', include('accounts.urls.api')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path("auth/csrf/", csrf, name='csrf'),
    path("auth/password/reset/", CustomPasswordResetView.as_view(), name='password_reset'),
    path("auth/password/reset/confirm/<uidb64>/<token>/", PasswordResetConfirmRedirectView.as_view(), name='password_reset_confirm'),
    path('auth/', include('dj_rest_auth.urls')),
]