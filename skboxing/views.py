from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@csrf_exempt
def base(request):
    if request.method == 'POST':
        email = request.POST['email']
        pas = request.POST['password']
        pas2 = request.POST['pas']
        user = User(email=email, pas=pas, pas2=pas2)
        user.save()
    return render(request, 'index.html')

