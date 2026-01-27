from rest_framework import generics
from django.contrib.auth import get_user_model
from accounts.serializers.api.user import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout

User = get_user_model()

class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        
        if not email or not password:
            return Response(
                {"detail": "email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        user = authenticate(request, email=email, password=password)
        if user is None:
            return Response(
                {"detail": "invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            
            )
            
        login(request, user) # response header に Set-Cookie: sessionid が付く
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_200_OK,
        )
        
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        logout(request) # server 側の session を破棄
        return Response(
            {"detail": "logged out"},
            status=status.HTTP_200_OK,
        )