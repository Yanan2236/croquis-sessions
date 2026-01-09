from django.urls import path, include
from accounts.views.api.user import UserView

urlpatterns = [
    path('me/', UserView.as_view(), name='user-detail'),
]