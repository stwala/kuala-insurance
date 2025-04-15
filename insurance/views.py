from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Claim
from .serializers import ClaimSerializer
from django.core.mail import send_mail  # Optional for notifications
from rest_framework import viewsets

# Submit a new claim
class ClaimCreateView(generics.CreateAPIView):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer

# List all claims (for admin/staff)
class ClaimListView(generics.ListAPIView):
    queryset = Claim.objects.all().order_by('-created_at')
    serializer_class = ClaimSerializer

class ClaimViewSet(viewsets.ModelViewSet):  # ✅ allows GET, POST, PUT, DELETE
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer

    def get_queryset(self):
        queryset = Claim.objects.all()
        email = self.request.query_params.get('email')
        if email:
         queryset = queryset.filter(email=email)
        return queryset

# View/Update a specific claim
class ClaimDetailView(generics.RetrieveUpdateAPIView):
    queryset = Claim.objects.all()
    serializer_class = ClaimSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsAdminUser()]
        return super().get_permissions()

    def perform_update(self, serializer):
        claim = self.get_object()
        user = self.request.user
        previous_status = claim.status
        updated_claim = serializer.save(approved_by=user if user.is_staff else claim.approved_by)

        # Send email only if status changed
        new_status = updated_claim.status
        if new_status != previous_status and updated_claim.email:
            send_mail(
                subject="Update on Your Insurance Claim",
                message=f"Dear {updated_claim.claimant_name},\n\nYour claim (ID: {updated_claim.id}) has been updated to '{new_status}'.\n\nThank you.",
                from_email="no-reply@insurancecorp.com",
                recipient_list=[updated_claim.email],
                fail_silently=False,
            )

