from django.views.generic import RedirectView
from django.conf import settings

class PasswordResetConfirmRedirectView(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        uid = kwargs["uidb64"]
        token = kwargs["token"]
        frontend = getattr(settings, "FRONTEND_ORIGIN", "http://localhost:5173").rstrip("/")
        return f"{frontend}/reset-password/{uid}/{token}/"