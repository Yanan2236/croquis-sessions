from django.urls import path, include

urlpatterns = [
    path('croquis/', include('croquis.urls.api')),
    path('accounts/', include('accounts.urls.api')),
]