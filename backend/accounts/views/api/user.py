from rest_framework import generics
from django.contrib.auth import get_user_model
from accounts.serializers.api.user import UserSerializer
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user