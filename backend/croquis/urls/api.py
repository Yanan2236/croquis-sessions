from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from croquis.views.api import SessionViewSet, DrawingViewSet, SubjectViewSet



router = DefaultRouter()
router.register(r"sessions", SessionViewSet, basename="session")

session_router = NestedDefaultRouter(router, r"sessions", lookup="session")
session_router.register(r"drawings", DrawingViewSet, basename="session-drawings")

router.register(r"subjects", SubjectViewSet, basename="subject")

urlpatterns = [
    *router.urls,
    *session_router.urls,
]