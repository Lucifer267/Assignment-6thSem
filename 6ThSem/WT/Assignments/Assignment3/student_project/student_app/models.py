from django.db import models

class Student(models.Model):
    roll_no = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    email = models.EmailField()
    course = models.CharField(max_length=50)
    address = models.TextField()

    def __str__(self):
        return self.name


# Django Admin username Hyper , password 1234509876 #