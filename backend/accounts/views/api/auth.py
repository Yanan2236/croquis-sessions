from dj_rest_auth.views import PasswordResetView
from accounts.serializers.password_reset import ReactPasswordResetSerializer

class CustomPasswordResetView(PasswordResetView):
    serializer_class = ReactPasswordResetSerializer
    
    