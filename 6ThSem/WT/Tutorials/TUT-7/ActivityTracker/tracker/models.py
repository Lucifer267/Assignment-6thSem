from django.db import models
from django.contrib.auth.models import User

# Minimal models - using Django's built-in User model
# Extended only if needed for specific tracking

class UserActivity(models.Model):
    """Track user login/logout activities"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=20)  # 'login' or 'logout'
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"
    
    class Meta:
        ordering = ['-timestamp']
