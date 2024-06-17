from django.shortcuts import render, redirect
from django.contrib import messages
from django.conf import settings
from rest_framework.decorators import api_view

import json
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.core.serializers import serialize

import jwt
from .utils import generate_access_token
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.hashers import make_password, check_password
from .models import Users, Products
from .serializers import UserSerializer, ProductSerializer


# @api_view(['POST'])
# @csrf_exempt
def register(request):

    if request.method == 'POST':
        username = request.POST['username']
        firstname = request.POST['firstName']
        lastname = request.POST['lastName']
        email = request.POST['email']
        password = request.POST['password']
        setPassword = request.POST['setPassword']
        role_id = 1
        if username == '':
            messages.info(request, 'Username must not be empty')
            return render(request, '../static/html/register.html')
            return JsonResponse("Username must not be empty", safe=False)
        elif firstname == '':
            messages.info(request, 'Fields must be filled')
            return render(request, '../static/html/register.html')
            return JsonResponse("Firstname must not be empty", safe=False)
        elif lastname == '':
            messages.info(request, 'Lastname must not be empty')
            return render(request, '../static/html/register.html')
            return JsonResponse("Lastname must not be empty", safe=False)
        elif email == '':
            messages.info(request, 'Email must not be empty')
            return render(request, '../static/html/register.html')
            return JsonResponse("Email must not be empty", safe=False)
        elif password == '':
            messages.info(request, 'Password must not be empty')
            return render(request, '../static/html/register.html')
            return JsonResponse("Password must not be empty", safe=False)
        elif setPassword == '':
            messages.info(request, 'Password confirmation must not be empty')
            return render(request, '../static/html/register.html') 
            return JsonResponse("Password confirmation must not be empty", safe=False)
        elif password != setPassword:
            messages.info(request, 'Passwords must be the same')
            return render(request, '../static/html/register.html') 
            return JsonResponse("Passwords must be the same", safe=False)
        else:
            hashed = make_password(password)
            try:
                user = Users(username=username, firstname=firstname, lastname=lastname, email=email, password=hashed, role_id=role_id)
                user.save()
                messages.info(request, 'User successfully created')
                return redirect('/')
                return JsonResponse("User successfully created", safe=False)
            except:
                messages.info(request, 'User already exists with this email')
                return render(request, '../static/html/register.html')
                return JsonResponse("User already exists with this email", safe=False)

    # return render(request, '../static/html/register.html')

# @api_view(['POST'])    
@csrf_exempt
def login(request):
    # response = redirect('/accueil')
    token = request.COOKIES.get("access_token")
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        except:
            return redirect('/')
        userID = payload['userID']
        # messages.info(request, userID)
        # return response

    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        if email == '':
            messages.info(request, 'Fields must be filled')
            return render(request, '../static/html/login.html')
            return JsonResponse("Email must not be empty", safe=False)
        elif password == '':
            messages.info(request, 'Fields must be filled')
            return render(request, '../static/html/login.html')
            return JsonResponse("Password must not be empty", safe=False)
        else:
            user = Users.objects.get(email=email)
            if check_password(password,user.password):
                user_access_token = generate_access_token(user.id)
                # response.set_cookie(key='access_token', value=user_access_token, max_age=None)
                # return response
                return JsonResponse({'authentification':'ok','usermail':email,'token':user_access_token})
            else:
                messages.info(request, 'Wrong informations')
                # return render(request, '../static/html/login.html')
                return JsonResponse("This user doesn't exist", safe=False)
            
    # return render(request, '../static/html/login.html')

# @csrf_exempt
def logout(request):
    response = redirect('/')
    response.delete_cookie('access_token')
    return response

# @api_view(['GET'])
@csrf_exempt
def users(request):
    try:
        token = request.COOKIES.get("access_token")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
    except:
        return JsonResponse("Permission denied", safe=False)
        # return redirect('/')
    
    userID = payload['userID']
    isAdmin = Users.objects.get(id=userID)
    if isAdmin.role_id == 1:
        return JsonResponse("Permission denied", safe=False)
        # return redirect('/')  
    if request.method == 'GET':
        users = Users.objects.all()
        users_serializer = UserSerializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False)

# @api_view(['GET','UPDATE','DELETE'])
# @csrf_exempt
def uniqueUser(request, id):
    try:
        token = request.COOKIES.get("access_token")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
    except:
        # return JsonResponse("Permission denied", safe=False)
        return redirect('/')

    userID = payload['userID']
    isAdmin = Users.objects.get(id=userID)

    if isAdmin.role_id == 2 or isAdmin.id == id:

        if request.method == 'GET':
            uniqueUser = Users.objects.filter(id=id)
            uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
            return JsonResponse(uniqueUser_serializer.data, safe=False)

        elif request.method == 'UPDATE':
            uniqueUser_data = JSONParser().parse(request)
            uniqueUser = Users.objects.get(id=id)
            if uniqueUser:
                try:
                    username = uniqueUser_data['username']
                    if username != '':
                        uniqueUser.username = username
                except:
                    None
                try:
                    firstname = uniqueUser_data['firstname']
                    if firstname != '':
                        uniqueUser.firstname = firstname
                except:
                    None
                try:
                    lastname = uniqueUser_data['lastname']
                    if lastname != '':
                        uniqueUser.lastname = lastname
                except:
                    None
                try:
                    email = uniqueUser_data['email']
                    if email != '':
                        uniqueUser.email = email
                except:
                    None
                try:
                    password = uniqueUser_data['password']
                    if password != '':
                        hashed = make_password(password)
                        uniqueUser.password = hashed
                except:
                    None
                if isAdmin.role_id == 2:
                    try:
                        role = uniqueUser_data['role']
                        if role == 1 or role == 2:
                            uniqueUser.role = role
                    except:
                        None 
                uniqueUser.save()
                return JsonResponse("User updated successfully", safe=False)
            else:
                return JsonResponse("This user doesn't exist", safe=False)

        elif request.method == 'DELETE':
            uniqueUser = Users.objects.get(id=id)
            uniqueUser.delete()
            return JsonResponse("User deleted Successfully", safe=False)
    else:
        return JsonResponse("Permission denied", safe=False)


# @api_view(['GET'])
# @csrf_exempt
def products(request):
    try:
        token = request.COOKIES.get("access_token")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
    except:
        # return JsonResponse("Permission denied", safe=False)
        return redirect('/')

    userID = payload['userID']
    isAdmin = Users.objects.get(id=userID)
    if isAdmin.role_id == 1:
        # return JsonResponse("Permission denied", safe=False)
        return redirect('/')
    if request.method == 'GET':
        products = Products.objects.all()
        products_serializer = ProductSerializer(products, many=True)
        return JsonResponse(products_serializer.data, safe=False)
    
# @api_view(['GET','UPDATE','DELETE'])
# @csrf_exempt
def uniqueProduct(request, id):
    try:
        token = request.COOKIES.get("access_token")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
    except:
        # return JsonResponse("Permission denied", safe=False)
        return redirect('/')

    userID = payload['userID']
    isAdmin = Users.objects.get(id=userID)

    if request.method == 'GET':
            uniqueProduct = Products.objects.filter(id=id)
            uniqueProduct_serializer = ProductSerializer(uniqueProduct, many=True)
            return JsonResponse(uniqueProduct_serializer.data, safe=False)
    
    if isAdmin.role_id == 2:

        if request.method == 'POST':
            image = request.POST['image']
            item_name = request.POST['item_name']
            description = request.POST['description']
            price = request.POST['price']
            if image == '':
                # messages.info(request, 'Fields must be filled')
                # return render(request, '../static/html/register.html')
                return JsonResponse("Image must not be empty", safe=False)
            elif item_name == '':
                # messages.info(request, 'Fields must be filled')
                # return render(request, '../static/html/register.html')
                return JsonResponse("Product name must not be empty", safe=False)
            elif description == '':
                # messages.info(request, 'Fields must be filled')
                # return render(request, '../static/html/register.html')
                return JsonResponse("Description must not be empty", safe=False)
            elif price == '':
                # messages.info(request, 'Fields must be filled')
                # return render(request, '../static/html/register.html')
                return JsonResponse("Price must not be empty", safe=False)
            else:
                try:
                    product = Products(image=image, item_name=item_name, description=description, price=price)
                    product.save()
                    # messages.info(request, 'User successfully created')
                    # return redirect('/')
                    return JsonResponse("Product successfully created", safe=False)
                except:
                    # messages.info(request, 'User already exists with this email')
                    # return render(request, '../static/html/register.html')
                    return JsonResponse("Product already exists with this name", safe=False)
                
                
        if request.method == 'UPDATE':
            uniqueProduct_data = JSONParser().parse(request)
            uniqueProduct = Products.objects.get(id=id)
            if uniqueProduct:
                try:
                    image = uniqueProduct_data['image']
                    if image != '':
                        uniqueProduct.image = image
                except:
                    None
                try:
                    item_name = uniqueProduct_data['item_name']
                    if item_name != '':
                        uniqueProduct.item_name = item_name
                except:
                    None
                try:
                    description = uniqueProduct_data['description']
                    if description != '':
                        uniqueProduct.description = description
                except:
                    None
                try:
                    price = uniqueProduct_data['price']
                    if price != '':
                        uniqueProduct.price = price
                except:
                    None   
                uniqueProduct.save()
                return JsonResponse("Product updated", safe=False)
            else:
                return JsonResponse("This product doesn't exist", safe=False)
        elif request.method == 'DELETE':
            uniqueUser = Products.objects.get(id=id)
            uniqueUser.delete()
            return JsonResponse("Product deleted Successfully", safe=False)
    else:
        return JsonResponse("Permission denied", safe=False)