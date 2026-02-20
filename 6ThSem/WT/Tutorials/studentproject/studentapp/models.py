from django.db import models

class Student(models.Model):
    roll_no = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15)
    email = models.EmailField()
    course = models.CharField(max_length=100)
    address = models.TextField()

    def __str__(self):
        return self.name
