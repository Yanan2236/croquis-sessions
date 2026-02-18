from django.urls import path, include

from accounts.views.api.user import csrf

urlpatterns = [
    path('croquis/', include('croquis.urls.api')),
    path('accounts/', include('accounts.urls.api')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path("auth/csrf/", csrf, name='csrf'),
]