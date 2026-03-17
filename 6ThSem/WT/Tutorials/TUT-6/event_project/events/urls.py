from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventRegistrationListView.as_view(), name='registration-list'),
    path('register/', views.EventRegistrationCreateView.as_view(), name='registration-create'),
    path('<int:pk>/', views.EventRegistrationDetailView.as_view(), name='registration-detail'),
    path('<int:pk>/update/', views.EventRegistrationUpdateView.as_view(), name='registration-update'),
    path('<int:pk>/delete/', views.EventRegistrationDeleteView.as_view(), name='registration-delete'),
]
