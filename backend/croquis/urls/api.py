from django.urls import path, include
from croquis.views.api.session import CroquisSessionListView

urlpatterns = [
    path('session/', CroquisSessionListView.as_view(), name="croquis-session-list"),
]
