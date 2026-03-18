from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Employee
from .forms import EmployeeForm


def employee_list(request):
    query = request.GET.get('q', '')
    department = request.GET.get('department', '')
    employees = Employee.objects.all()
    if query:
        employees = employees.filter(
            first_name__icontains=query
        ) | employees.filter(
            last_name__icontains=query
        ) | employees.filter(
            email__icontains=query
        )
    if department:
        employees = employees.filter(department=department)
    context = {
        'employees': employees,
        'query': query,
        'selected_dept': department,
        'total': Employee.objects.count(),
        'active': Employee.objects.filter(is_active=True).count(),
    }
    return render(request, 'employees/employee_list.html', context)


def employee_detail(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    return render(request, 'employees/employee_detail.html', {'employee': employee})


def employee_create(request):
    if request.method == 'POST':
        form = EmployeeForm(request.POST)
        if form.is_valid():
            employee = form.save()
            messages.success(request, f'Employee {employee.get_full_name()} added successfully!')
            return redirect('employee_list')
    else:
        form = EmployeeForm()
    return render(request, 'employees/employee_form.html', {'form': form, 'title': 'Add New Employee'})


def employee_update(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == 'POST':
        form = EmployeeForm(request.POST, instance=employee)
        if form.is_valid():
            form.save()
            messages.success(request, f'Employee {employee.get_full_name()} updated successfully!')
            return redirect('employee_list')
    else:
        form = EmployeeForm(instance=employee)
    return render(request, 'employees/employee_form.html', {'form': form, 'title': 'Edit Employee', 'employee': employee})


def employee_delete(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == 'POST':
        name = employee.get_full_name()
        employee.delete()
        messages.success(request, f'Employee {name} deleted.')
        return redirect('employee_list')
    return render(request, 'employees/employee_confirm_delete.html', {'employee': employee})

