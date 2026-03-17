from django import forms
from django.core.exceptions import ValidationError
import re
from .models import EventRegistration

class EventRegistrationForm(forms.ModelForm):
    class Meta:
        model = EventRegistration
        fields = ['participant_name', 'email', 'event_name', 'contact_number']
        widgets = {
            'participant_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your full name'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your email address'
            }),
            'event_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter event name'
            }),
            'contact_number': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your contact number (9-15 digits)'
            }),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise ValidationError("Email is required.")
        # Additional email validation
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            raise ValidationError("Please enter a valid email address.")
        return email

    def clean_contact_number(self):
        contact_number = self.cleaned_data.get('contact_number')
        if not contact_number:
            raise ValidationError("Contact number is required.")
        # Validate contact number format (9-15 digits, optional + at start)
        if not re.match(r'^\+?1?\d{9,15}$', contact_number):
            raise ValidationError("Contact number must be 9-15 digits, optionally starting with +.")
        return contact_number

    def clean_participant_name(self):
        name = self.cleaned_data.get('participant_name')
        if not name or len(name.strip()) < 2:
            raise ValidationError("Participant name must be at least 2 characters long.")
        return name

    def clean_event_name(self):
        event_name = self.cleaned_data.get('event_name')
        if not event_name or len(event_name.strip()) < 2:
            raise ValidationError("Event name must be at least 2 characters long.")
        return event_name
