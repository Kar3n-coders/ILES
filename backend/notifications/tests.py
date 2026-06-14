from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from users.models import CustomUser
from placements.models import InternshipPlacement
from logbook.models import Logbook
from reviews.models import LogReview
from notifications.models import Notification


def make_user(username, role, password="testpass123"):
    return CustomUser.objects.create_user(username=username, password=password, role=role)


class TestNotificationModel(TestCase):
    def setUp(self):
        self.user = make_user("alice", "student")

    def test_create_notification(self):
        n = Notification.objects.create(
            recipient=self.user,
            title="Test title",
            message="Test message",
            notification_type="logbook_submitted",
        )
        self.assertEqual(n.recipient, self.user)
        self.assertEqual(n.title, "Test title")
        self.assertFalse(n.is_read)

    def test_str_representation(self):
        n = Notification.objects.create(
            recipient=self.user,
            title="Hello",
            message="World",
            notification_type="logbook_submitted",
        )
        self.assertIn(self.user.username, str(n))
        self.assertIn("Hello", str(n))


class TestNotificationAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_a = make_user("user_a", "student")
        self.user_b = make_user("user_b", "student")

        self.notif_a1 = Notification.objects.create(
            recipient=self.user_a,
            title="A notif 1",
            message="msg",
            notification_type="logbook_submitted",
        )
        self.notif_a2 = Notification.objects.create(
            recipient=self.user_a,
            title="A notif 2",
            message="msg",
            notification_type="logbook_reviewed",
        )
        Notification.objects.create(
            recipient=self.user_b,
            title="B notif",
            message="msg",
            notification_type="logbook_submitted",
        )

        self.client.force_authenticate(user=self.user_a)

    def test_list_own_notifications(self):
        resp = self.client.get("/api/notifications/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        results = data if isinstance(data, list) else data.get("results", data)
        ids = [n["id"] for n in results]
        self.assertIn(self.notif_a1.id, ids)
        self.assertIn(self.notif_a2.id, ids)
        self.assertEqual(len(ids), 2)

    def test_unread_count(self):
        resp = self.client.get("/api/notifications/unread_count/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["count"], 2)

    def test_mark_one_read(self):
        resp = self.client.post(f"/api/notifications/{self.notif_a1.id}/read/")
        self.assertEqual(resp.status_code, 200)
        self.notif_a1.refresh_from_db()
        self.assertTrue(self.notif_a1.is_read)

    def test_mark_all_read(self):
        resp = self.client.post("/api/notifications/read_all/")
        self.assertEqual(resp.status_code, 200)
        unread = Notification.objects.filter(recipient=self.user_a, is_read=False).count()
        self.assertEqual(unread, 0)

    def test_unauthenticated_returns_401(self):
        self.client.logout()
        resp = self.client.get("/api/notifications/")
        self.assertEqual(resp.status_code, 401)


class TestNotificationSignals(TestCase):
    def setUp(self):
        self.student = make_user("student1", "student")
        self.ws = make_user("supervisor1", "workplace_supervisor")
        self.as_ = make_user("acadsupervisor1", "academic_supervisor")
        self.admin = make_user("admin1", "internship_admin")

        self.placement = InternshipPlacement.objects.create(
            student=self.student,
            company_name="Acme Corp",
            supervisor=self.ws,
            academic_supervisor=self.as_,
            start_date=timezone.now(),
            end_date=timezone.now(),
            status="approved",
        )

    def test_logbook_submit_notifies_supervisors(self):
        Notification.objects.all().delete()
        logbook = Logbook.objects.create(
            student=self.student,
            placement=self.placement,
            week_number=1,
            start_date=timezone.now(),
            end_date=timezone.now(),
            activities="Did stuff",
            status="pending",
        )
        ws_notifs = Notification.objects.filter(recipient=self.ws, notification_type="logbook_submitted")
        as_notifs = Notification.objects.filter(recipient=self.as_, notification_type="logbook_submitted")
        self.assertEqual(ws_notifs.count(), 1)
        self.assertEqual(as_notifs.count(), 1)

    def test_log_review_notifies_student(self):
        logbook = Logbook.objects.create(
            student=self.student,
            placement=self.placement,
            week_number=2,
            start_date=timezone.now(),
            end_date=timezone.now(),
            activities="Did more stuff",
            status="pending",
        )
        Notification.objects.all().delete()
        LogReview.objects.create(
            Logbook=logbook,
            reviewer=self.ws,
            action="approved",
            comment="Great work",
        )
        student_notifs = Notification.objects.filter(
            recipient=self.student,
            notification_type="logbook_reviewed",
        )
        self.assertEqual(student_notifs.count(), 1)
        self.assertIn("approved", student_notifs.first().title.lower())

    def test_placement_created_notifies_admins(self):
        Notification.objects.all().delete()
        student2 = make_user("student2", "student")
        InternshipPlacement.objects.create(
            student=student2,
            company_name="Beta Ltd",
            start_date=timezone.now(),
            end_date=timezone.now(),
        )
        admin_notifs = Notification.objects.filter(
            recipient=self.admin,
            notification_type="placement_created",
        )
        self.assertEqual(admin_notifs.count(), 1)

    def test_placement_status_change_notifies_student(self):
        new_placement = InternshipPlacement.objects.create(
            student=self.student,
            company_name="Gamma Inc",
            start_date=timezone.now(),
            end_date=timezone.now(),
            status="pending",
        )
        Notification.objects.all().delete()
        new_placement.status = "approved"
        new_placement.save()
        student_notifs = Notification.objects.filter(
            recipient=self.student,
            notification_type="placement_status_changed",
        )
        self.assertEqual(student_notifs.count(), 1)
