from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

from croquis.models import CroquisSession, Subject


class SessionAPITest(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="testuser", password="pass1234")
        self.client.force_authenticate(user=self.user)

    def test_list_sessions(self):
        url = reverse("session-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_create_session(self):
        url = reverse("session-list")
        subject = Subject.objects.create(user=self.user, name="anatomy")
        payload = {
            "subject": subject.id,
            "intention": "practice hands",
        }

        res = self.client.post(url, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED, res.data)
        self.assertIn("id", res.data)
        self.assertEqual(res.data["user"], self.user.id)
        self.assertEqual(res.data["subject"], payload["subject"])
        self.assertEqual(res.data["intention"], payload["intention"])


    def test_finish_session_patch(self):
        create_url = reverse("session-list")
        subject = Subject.objects.create(user=self.user, name="gesture")
        create_payload = {"subject": subject.id, "intention": "quick poses"}
        create_res = self.client.post(create_url, create_payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED, create_res.data)
        session_id = create_res.data["id"]

        detail_url = reverse("session-detail", args=[session_id])
        finish_payload = {
            "reflection": "good",
            "next_action": "more legs",
            "note": "keep it simple",
            "is_public": False,
        }

        res = self.client.patch(detail_url, finish_payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK, res.data)
        self.assertIsNotNone(res.data["ended_at"])
        self.assertEqual(res.data["reflection"], finish_payload["reflection"])
        self.assertEqual(res.data["is_public"], finish_payload["is_public"])

