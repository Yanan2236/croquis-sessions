from django.urls import path, include
from accounts.views.api.user import UserView, LoginView, LogoutView

urlpatterns = [
    path("me/", UserView.as_view(), name='user-detail'),
    path("login/", LoginView.as_view(), name='login'),
    path("logout/", LogoutView.as_view(), name='logout'),
]