from django.contrib import admin, messages
from .models import Claim
from django.utils import timezone
from django.core.mail import send_mail

@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ('id', 'claimant_name', 'claim_type', 'status', 'created_at', 'is_discharged', 'discharge_date')
    list_filter = ('claim_type', 'status', 'is_discharged')
    search_fields = ('claimant_name', 'email')
    actions = ['mark_as_discharged']

    def save_model(self, request, obj, form, change):
        if obj.is_discharged and not obj.discharge_date:
            obj.discharge_date = timezone.now()
        super().save_model(request, obj, form, change)

    @admin.action(description='Mark selected claims as discharged and notify')
    def mark_as_discharged(self, request, queryset):
        for claim in queryset:
            if claim.status == 'APPROVED' and not claim.is_discharged:
                claim.is_discharged = True
                claim.discharge_date = timezone.now()
                claim.save()

                try:
                    send_mail(
                        subject="Claim Discharged and Paid",
                        message=f"Dear {claim.claimant_name},\n\nYour claim has been successfully discharged and payment has been made.",
                        from_email="sitwalanamakando@gmail.com",
                        recipient_list=[claim.email],
                        fail_silently=False,
                    )
                    self.message_user(
                        request,
                        f"Notification email sent to {claim.claimant_name} ({claim.email}).",
                        level=messages.SUCCESS
                    )
                except Exception as e:
                    self.message_user(
                        request,
                        f"Error sending email to {claim.claimant_name} ({claim.email}): {e}",
                        level=messages.ERROR
                    )
