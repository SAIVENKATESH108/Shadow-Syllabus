import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.users.models import User

# Use create_user or set username
user = User.objects.filter(email="synthetic.student@example.org").first()
if not user:
    user = User.objects.create_user(
        email="synthetic.student@example.org",
        username="synthetic_student_alpha",
        password="SyntheticPassword123!",
        first_name="Synthetic",
        last_name="Student",
        role=User.Role.STUDENT,
    )
print("SYNTHETIC USER A READY:", user.email, "ID:", str(user.id))

user_b = User.objects.filter(email="synthetic.beta@example.org").first()
if not user_b:
    user_b = User.objects.create_user(
        email="synthetic.beta@example.org",
        username="synthetic_student_beta",
        password="SyntheticPassword456!",
        first_name="Beta",
        last_name="Learner",
        role=User.Role.STUDENT,
    )
print("SYNTHETIC USER B READY:", user_b.email, "ID:", str(user_b.id))
