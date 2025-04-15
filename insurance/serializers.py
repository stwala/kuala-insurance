from rest_framework import serializers
from .models import Claim

class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = '__all__'
        read_only_fields = ['status', 'approved_by', 'created_at']

    def validate_description(self, value):
        word_count = len(value.split())
        if word_count < 10:
            raise serializers.ValidationError(
                "Please provide a more detailed description of the incident (at least 10 words)."
            )

        # Optional: very basic NLP logic
        suspicious_keywords = ['fraud', 'scam', 'fake']
        if any(word in value.lower() for word in suspicious_keywords):
            raise serializers.ValidationError(
                "Your description contains words that may flag the claim for manual review."
            )

        return value
