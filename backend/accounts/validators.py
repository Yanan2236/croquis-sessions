# accounts/validators.py
import re
from django.core.exceptions import ValidationError

class AlphaNumericPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r"[A-Za-z]", password) or not re.search(r"[0-9]", password):
            raise ValidationError(
                "パスワードは英字と数字を両方含めてください。",
                code="password_no_alnum_mix",
            )

    def get_help_text(self):
        return "英字と数字を両方含める必要があります。"
