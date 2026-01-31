from rest_framework import serializers

from croquis.models import Drawing

class DrawingSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Drawing
        fields = ['id', 'order', 'created_at', 'image_url']
        read_only_fields = fields
        
    def get_image_url(self, obj):
        if not obj.image_file:
            return None 
        
        url = obj.image_file.url
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url

        
class DrawingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drawing
        fields = ['image_file', 'order']  

class DrawingThumbnailSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Drawing
        fields = ["id", "image_url"]
        
    def get_image_url(self, obj):
        if not obj.image_file:
            return None 
        
        url = obj.image_file.url
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url