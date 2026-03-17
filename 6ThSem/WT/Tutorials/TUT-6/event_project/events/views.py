from django.shortcuts import render
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.urls import reverse_lazy
from .models import EventRegistration
from .forms import EventRegistrationForm

class EventRegistrationListView(ListView):
    model = EventRegistration
    template_name = 'events/event_list.html'
    context_object_name = 'registrations'
    paginate_by = 10

class EventRegistrationCreateView(CreateView):
    model = EventRegistration
    form_class = EventRegistrationForm
    template_name = 'events/event_form.html'
    success_url = reverse_lazy('registration-list')

class EventRegistrationDetailView(DetailView):
    model = EventRegistration
    template_name = 'events/event_detail.html'
    context_object_name = 'registration'

class EventRegistrationUpdateView(UpdateView):
    model = EventRegistration
    form_class = EventRegistrationForm
    template_name = 'events/event_form.html'
    success_url = reverse_lazy('registration-list')

class EventRegistrationDeleteView(DeleteView):
    model = EventRegistration
    template_name = 'events/event_confirm_delete.html'
    success_url = reverse_lazy('registration-list')
