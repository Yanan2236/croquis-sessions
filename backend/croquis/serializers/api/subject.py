from rest_framework import serializers
from croquis.models import Subject

class SubjectSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
        ]
        read_only_fields = fields