from rest_framework import serializers

from croquis.models import Drawing

class DrawingSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(
        source='image_file',
        read_only=True,
    )
    class Meta:
        model = Drawing
        fields = ['id', 'order', 'created_at', 'image_url']
        read_only_fields = ['id', 'order', 'created_at', 'image_url']

        
class DrawingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drawing
        fields = ['image_file']  
