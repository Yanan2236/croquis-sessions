from urllib.parse import urlencode
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from dj_rest_auth.serializers import PasswordResetSerializer

def react_password_reset_url(request, user, temp_key):
    frontend = getattr(settings, "FRONTEND_ORIGIN", "http://localhost:5173").rstrip("/")
    qs = urlencode({"uid": str(user.pk), "token": temp_key})
    return f"{frontend}/auth/reset-password?{qs}"

class ReactPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        return {"url_generator": react_password_reset_url}