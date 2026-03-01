from django.views.generic import RedirectView

class PasswordResetConfirmRedirectView(RedirectView):
    permanent = False

    def get_redirect_url(self, *args, **kwargs):
        uid = kwargs["uidb64"]
        token = kwargs["token"]
        return f"http://localhost:5173/reset-password/{uid}/{token}/"