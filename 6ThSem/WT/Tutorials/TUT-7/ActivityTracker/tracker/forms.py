from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=False)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Username already taken")
        return username
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Choose a username', 'autocomplete': 'username'})
        self.fields['email'].widget.attrs.update({'class': 'form-control', 'placeholder': 'name@example.com', 'autocomplete': 'email'})
        self.fields['password1'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Create a password', 'autocomplete': 'new-password'})
        self.fields['password2'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Repeat the password', 'autocomplete': 'new-password'})


class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Your username', 'autocomplete': 'username'})
        self.fields['password'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Your password', 'autocomplete': 'current-password'})
