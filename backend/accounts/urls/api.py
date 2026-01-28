from django.urls import path, include
from rest_framework.routers import DefaultRouter


from accounts.views.api.user import MeView, LoginView, LogoutView, SignupView

urlpatterns = [
    path("me/", MeView.as_view(), name='user-detail'),
    path("login/", LoginView.as_view(), name='login'),
    path("logout/", LogoutView.as_view(), name='logout'),
    path("signup/", SignupView.as_view(), name='signup'),
]