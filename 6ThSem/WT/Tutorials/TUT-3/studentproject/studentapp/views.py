from django.shortcuts import render
from .models import Student

def student_list(request):
    students = Student.objects.all()   # Fetch data using ORM
    return render(request, 'studentapp/student_list.html', {'students': students})
