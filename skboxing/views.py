from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import User


# Create your views here.
def base(request):
    if request.method == 'POST':
        email = request.POST['email']
        pas = request.POST['password']
        user = User(email=email, pas=pas)
        user.save()
    return render(request, 'base.html')

