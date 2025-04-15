from django.db import models
from django.core.exceptions import ValidationError

class Claim(models.Model):
    CLAIM_TYPE_CHOICES = [
        ('HEALTH', 'Health'),
        ('VEHICLE', 'Vehicle'),
        ('PROPERTY', 'Property'),
        ('LIFE', 'Life'),
        ('TRAVEL', 'Travel'),
    ]

    CLAIM_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('DENIED', 'Denied'),
    ]

    claimant_name = models.CharField(max_length=100)
    email = models.EmailField()
    claim_type = models.CharField(max_length=20, choices=CLAIM_TYPE_CHOICES)
    description = models.TextField()
    document = models.FileField(upload_to='claims/')
    status = models.CharField(max_length=20, choices=CLAIM_STATUS_CHOICES, default='PENDING')
    priority = models.IntegerField(default=0)
    approved_by = models.CharField(max_length=100, blank=True, null=True)
    is_discharged = models.BooleanField(default=False)
    discharge_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.claimant_name} - {self.claim_type} - {self.status}"
    
    def clean(self):
        if self.is_discharged and self.status != 'APPROVED':
            raise ValidationError("Claim must be approved before it can be discharged.")
    
    
