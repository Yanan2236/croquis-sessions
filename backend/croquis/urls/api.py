from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from django.urls import path, include

from croquis.views.api import SessionViewSet, DrawingViewSet, SubjectViewSet



router = DefaultRouter()
router.register(r"sessions", SessionViewSet, basename="session")

session_router = NestedDefaultRouter(router, r"sessions", lookup="session")
session_router.register(r"drawings", DrawingViewSet, basename="session-drawings")

router.register(r"subjects", SubjectViewSet, basename="subject")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(session_router.urls)),
]