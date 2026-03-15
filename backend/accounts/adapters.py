from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings
from urllib.parse import urlencode

class AccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        frontend = getattr(settings, "FRONTEND_ORIGIN", "http://localhost:5173").rstrip("/")
        qs = urlencode({"key": emailconfirmation.key})
        return f"{frontend}/auth/verify-email?{qs}"
