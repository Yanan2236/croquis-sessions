from rest_framework import generics
from django.contrib.auth import get_user_model
from accounts.serializers.api.user import UserSerializer, SignupSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout

User = get_user_model()

class MeView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

    
class SignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = SignupSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raw_password = serializer.validated_data["password"]
        user = serializer.save()
        
        # 新規登録後、自動ログイン
        authenticated_user = authenticate(request, email=user.email, password=raw_password)
        login(request, authenticated_user)
        return Response(status=status.HTTP_201_CREATED)
    
    
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