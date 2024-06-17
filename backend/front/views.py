from django.shortcuts import render, redirect
from django.conf import settings
from rest_framework.decorators import api_view
from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator

import json
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.core.serializers import serialize

import jwt
from .utils import generate_access_token
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.hashers import make_password, check_password
from .models import Users, Products, Orders, CurrentOrders
from .serializers import UserSerializer, ProductSerializer, OrderSerializer, CurrentOrdersSerializer

def usertype(request):

    if request.method == 'POST':
        cookie = JSONParser().parse(request)
        payload = jwt.decode(cookie['cookie']['access_token'], settings.SECRET_KEY, algorithms='HS256')
        userID = payload['userID']

        try:
            user = Users.objects.get(id=userID)
            if user.role_id == 2:
                # print('admin')
                return JsonResponse({'admin':'http://127.0.0.1:3000/home/admin', 'ok':'http://127.0.0.1:3000/home','userid': user.id})
            elif user.role_id == 1 or user.role_id == 2:
                # print('user')
                return JsonResponse({'user':'http://127.0.0.1:3000/home/products', 'ok':'http://127.0.0.1:3000/home','userid': user.id})
            else:       
                return JsonResponse({'notok':'http://127.0.0.1:3000/login'})
        except:
            return JsonResponse({'notok':'http://127.0.0.1:3000/login'})

def register(request):

    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        username = user_data['data']['username']
        firstname = user_data['data']['firstName']
        lastname = user_data['data']['lastName']
        email = user_data['data']['email']
        password = user_data['data']['password']
        setPassword = user_data['data']['setPassword']
        role_id = 1
        hashed = make_password(password)
        if(password != setPassword):
            return JsonResponse({'pswd':'Les mots de passe ne correspondent pas'})

        try:
            user = Users(username=username, firstname=firstname, lastname=lastname, email=email, password=hashed, role_id=role_id)
            user.save()
            return JsonResponse({'ok':'Utilisateur créé avec succes','redirect':'http://127.0.0.1:3000/'})
        except:
            return JsonResponse({'mail': 'Un utilisateur existe déjà avec cet email ou ce username', 'redirect':'http://127.0.0.1:3000/register'})

def login(request):

    if request.method == 'POST':
        
        user_data = JSONParser().parse(request)
        email = user_data['data']['email']
        password = user_data['data']['password']
        
        try:
            user = Users.objects.get(email=email)
        except:
            return JsonResponse({'redirect':'http://127.0.0.1:3000/', 'mail':"Cet email n'est associé à aucun compte"})

        if check_password(password,user.password):
            user_access_token = generate_access_token(user.id)
            return JsonResponse({'redirect':'http://127.0.0.1:3000/home', 'access_token': user_access_token})

        else:
            return JsonResponse({'redirect':'http://127.0.0.1:3000/', 'pswd':"Mot de passe incorect"})

def users(request):

    access_token = request.COOKIES.get('access_token', 'Cookie not found')
    # print(access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
    userID = payload['userID']
    # print(userID)
    uniqueUser = Users.objects.filter(id=userID)
    uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
    # print(uniqueUser_serializer.data[0]['role'])
    isUser = uniqueUser_serializer.data[0]['role']

    if isUser == 2:

        if request.method == 'GET':
            users = Users.objects.all()
            users_serializer = UserSerializer(users, many=True)
            return JsonResponse(users_serializer.data, safe=False)
        
        elif request.method == 'POST':

            user_data = JSONParser().parse(request)
            # print(user_data)
            username = user_data['data']['username']
            firstname = user_data['data']['firstname']
            lastname = user_data['data']['lastname']
            email = user_data['data']['email']
            password = user_data['data']['password']
            setPassword = user_data['data']['setPassword']
            if(password != setPassword):
                return JsonResponse({'pswd':'Les mots de passe ne correspondent pas'})

            hashed = make_password(password)
            role_id = user_data['data']['role_id']
            # print(username, firstname, lastname, email, role_id)
            try:
                product = Users(username=username, firstname=firstname, lastname=lastname, email=email, password=hashed, role_id=role_id)
                product.save()
                print('créé???')
                return JsonResponse({'created':"L'utilisateur a bien été créé"})

            except:
                print('pascréé???')
                return JsonResponse({'notcreated': 'Un utilisateur existe déjà avec cet email ou ce username'})

def uniqueUser(request, id):

    access_token = request.COOKIES.get('access_token', 'Cookie not found')
    # print(access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
    userID = payload['userID']
    # print(userID)
    uniqueUser = Users.objects.filter(id=userID)
    uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
    # print(uniqueUser_serializer.data[0]['role'])
    isUser = uniqueUser_serializer.data[0]['role']

    if isUser == 1 or isUser == 2:
        if request.method == 'GET':
            uniqueUser = Users.objects.filter(id=id)
            uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
            return JsonResponse(uniqueUser_serializer.data, safe=False)
    
        elif request.method == 'PUT':

            user_data = JSONParser().parse(request)        
            uniqueUser = Users.objects.get(id=id)
            if uniqueUser:
                if user_data['data']['username'] != '':
                    username = user_data['data']['username']
                    uniqueUser.username = username

                if user_data['data']['firstname'] != '':
                    firstname = user_data['data']['firstname']
                    uniqueUser.firstname = firstname

                if user_data['data']['lastname'] != '':
                    lastname = user_data['data']['lastname']
                    uniqueUser.lastname = lastname

                if user_data['data']['email'] != '':
                    email = user_data['data']['email']
                    uniqueUser.email = email

                if user_data['data']['password'] != '':
                    password = user_data['data']['password']
                    hashed = make_password(password)
                    uniqueUser.password = hashed

                if user_data['data']['role_id'] != '':
                    if user_data['data']['role_id'] == '1' or user_data['data']['role_id'] == '2':
                        role_id = user_data['data']['role_id']
                        uniqueUser.role_id = role_id
                        
                uniqueUser.save()
                return JsonResponse({'updated':'Utilisateur modifié avec succès'})
            
            else:
                return JsonResponse({'notupdated':'La modification a échouée'})

        elif request.method == 'DELETE':
            uniqueUser = Users.objects.get(id=id)
            uniqueUser.delete()
            
            deleteOrders = Orders.objects.filter(user_id=id)
            deleteOrders.delete()
            
            deleteBag = CurrentOrders.objects.filter(user_id=id)
            deleteBag.delete()
            return JsonResponse({'redirect':'http://127.0.0.1:3000/home/admin/users'})

def products(request):

    access_token = request.COOKIES.get('access_token', 'Cookie not found')
    # print(access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
    userID = payload['userID']
    # print(userID)
    uniqueUser = Users.objects.filter(id=userID)
    uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
    # print(uniqueUser_serializer.data[0]['role'])
    isUser = uniqueUser_serializer.data[0]['role']

    if isUser == 1 or isUser == 2:

        if request.method == 'GET':
            products = Products.objects.all()
            products_serializer = ProductSerializer(products, many=True)
            return JsonResponse(products_serializer.data, safe=False)
    
    if isUser == 2:

        if request.method == 'POST':

            product_data = JSONParser().parse(request)
            # print(product_data)
            image = product_data['data']['image']
            item_name = product_data['data']['item_name']
            description = product_data['data']['description']
            price = product_data['data']['price']
            # print(image, item_name, price, description)
            try:
                product = Products(image=image, item_name=item_name, description=description, price=price)
                product.save()
                return JsonResponse({'created':'Le produit a bien été créé'})

            except:
                return JsonResponse({'notcreated':'La création a échouée'})

def uniqueProduct(request, id):

    access_token = request.COOKIES.get('access_token', 'Cookie not found')
    # print(access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
    userID = payload['userID']
    # print(userID)
    uniqueUser = Users.objects.filter(id=userID)
    uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
    # print(uniqueUser_serializer.data[0]['role'])
    isUser = uniqueUser_serializer.data[0]['role']

    if isUser == 2:

        if request.method == 'GET':
            uniqueProduct = Products.objects.filter(id=id)
            uniqueProduct_serializer = ProductSerializer(uniqueProduct, many=True)
            return JsonResponse(uniqueProduct_serializer.data, safe=False)

        elif request.method == 'PUT':
            product_data = JSONParser().parse(request)
            uniqueProduct = Products.objects.get(id=id)
            if uniqueProduct:
                if product_data['data']['image'] != '':
                    image = product_data['data']['image']
                    uniqueProduct.image = image

                if product_data['data']['item_name'] != '':
                    item_name = product_data['data']['item_name']
                    uniqueProduct.item_name = item_name

                if product_data['data']['description'] != '':
                    description = product_data['data']['description']
                    uniqueProduct.description = description

                if product_data['data']['price'] != '':
                    price = product_data['data']['price']
                    uniqueProduct.price = price
                        
                uniqueProduct.save()
                return JsonResponse({'updated':'Produit modifié avec succès'})
            
            else:
                return JsonResponse({'notupdated':'La modification a échouée'})
        
        elif request.method == 'DELETE':
            uniqueProduct = Products.objects.get(id=id)
            uniqueProduct.delete()
            return JsonResponse({'redirect':'http://127.0.0.1:3000/home/admin'})
        
def orders(request, id):

    access_token = request.COOKIES.get('access_token', 'Cookie not found')
    # print(access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
    userID = payload['userID']
    # print(userID)
    uniqueUser = Users.objects.filter(id=userID)
    uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
    # print(uniqueUser_serializer.data[0]['role'])
    isUser = uniqueUser_serializer.data[0]['role']

    if isUser == 1 or isUser == 2:
 
        if request.method == 'GET':
            products = []
            new = []
            i = 0
            userOrders = Orders.objects.filter(user_id=id)
            products_serializer = OrderSerializer(userOrders, many=True)
            while i < len(products_serializer.data):
                product = Products.objects.filter(id=products_serializer.data[i]['product_id'])
                product_serializer = ProductSerializer(product, many=True)
                products.append(product_serializer.data[0])
                i+=1
            i = 0
            while i < len(products_serializer.data):
                new.append({**products_serializer.data[i], **products[i]})
                i+=1
            
            # print(new)
            return JsonResponse({'products': new})
    
def currentOrders(request, id):

    access_token = request.COOKIES.get('access_token', 'Cookie not found')
    # print(access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
    userID = payload['userID']
    # print(userID)
    uniqueUser = Users.objects.filter(id=userID)
    uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
    # print(uniqueUser_serializer.data[0]['role'])
    isUser = uniqueUser_serializer.data[0]['role']

    if isUser == 1 or isUser == 2:

        if request.method == 'POST':
            product_data = JSONParser().parse(request)
            product_id = id
            user_id = product_data['user_id']
            # print(product_id, user_id)

            try:
                currentOrder = CurrentOrders(product_id=product_id, user_id=user_id, quantity=1)
                currentOrder.save()
                return JsonResponse({'saved':'Le produit a bien été mit dans le panier'})
            except:
                return JsonResponse({'notsaved':'L\'ajout a échouée'})
        
        elif request.method == 'GET':
            try:
                products = []
                new = []
                i = 0
                bag = CurrentOrders.objects.filter(user_id=id)
                products_serializer = CurrentOrdersSerializer(bag, many=True)
                
                while i < len(products_serializer.data):
                    product = Products.objects.filter(id=products_serializer.data[i]['product_id'])
                    product_serializer = ProductSerializer(product, many=True)
                    products.append(product_serializer.data[0])
                    i+=1
                
                i = 0

                while i < len(products_serializer.data):
                    new.append({**products_serializer.data[i], **products[i]})
                    i += 1
                return JsonResponse({'bag': new})

            except:
                return JsonResponse({'bagEmpty':'Panier vide'})
            
        elif request.method == 'PUT':
                product_data = JSONParser().parse(request)
                user_id = product_data['user_id']
                product_id = product_data['product_id']
                uniqueProduct = CurrentOrders.objects.filter(user_id=user_id, product_id=product_id)
                if uniqueProduct.exists():
                    productToDelete = uniqueProduct.first()
                    productToDelete.delete()
                    return JsonResponse({'deleted':'Item supprimé'})
            
def currentOrdersToOrders(request, id):

    access_token = request.COOKIES.get('access_token', 'Cookie not found')
    # print(access_token)
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
    userID = payload['userID']
    # print(userID)
    uniqueUser = Users.objects.filter(id=userID)
    uniqueUser_serializer = UserSerializer(uniqueUser, many=True)
    # print(uniqueUser_serializer.data[0]['role'])
    isUser = uniqueUser_serializer.data[0]['role']

    if isUser == 1 or isUser == 2:

        if request.method == 'POST':
            deleteBag = CurrentOrders.objects.filter(user_id=id)
            products_serializer = CurrentOrdersSerializer(deleteBag, many=True)
            i=0
            numberOfProducts = len(products_serializer.data)
            while i < numberOfProducts:
                # print(products_serializer.data[i]['product_id'])
                order = Orders(user_id=products_serializer.data[i]['user_id'], product_id=products_serializer.data[i]['product_id'], quantity=products_serializer.data[i]['quantity'])
                order.save()
                i += 1
            deleteBag.delete()
            return JsonResponse({'deleted':'Produits supprimés'})
