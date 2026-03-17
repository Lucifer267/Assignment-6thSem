from django.contrib import admin
from .models import EventRegistration

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('participant_name', 'email', 'event_name', 'contact_number', 'registration_date')
    list_filter = ('event_name', 'registration_date')
    search_fields = ('participant_name', 'email', 'event_name', 'contact_number')
    readonly_fields = ('registration_date',)
    fieldsets = (
        ('Personal Information', {
            'fields': ('participant_name', 'email', 'contact_number')
        }),
        ('Event Information', {
            'fields': ('event_name',)
        }),
        ('Registration Details', {
            'fields': ('registration_date',)
        }),
    )
