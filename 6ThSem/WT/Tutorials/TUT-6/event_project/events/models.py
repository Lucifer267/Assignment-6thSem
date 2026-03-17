from django.db import models
from django.core.validators import EmailValidator, RegexValidator

class EventRegistration(models.Model):
    participant_name = models.CharField(max_length=100)
    email = models.EmailField(validators=[EmailValidator()])
    event_name = models.CharField(max_length=200)
    registration_date = models.DateTimeField(auto_now_add=True)
    contact_number = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message='Contact number must be between 9-15 digits, optionally starting with +'
        )]
    )

    def __str__(self):
        return f"{self.participant_name} - {self.event_name}"

    class Meta:
        ordering = ['-registration_date']
