from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name='login'),
    path('register', views.register, name='register'),
    # path('logout', views.logout, name='logout'),
    path('users', views.users, name='users'),
    path('users/<int:id>', views.uniqueUser, name='uniqueUser'),
    path('products', views.products, name='products'),
    path('products/<int:id>', views.uniqueProduct, name='uniqueProduct'),
    path('usertype', views.usertype, name='usertype'),
    path('orders/<int:id>', views.orders, name='orders'),
    path('currentOrders/<int:id>', views.currentOrders, name='currentOrders'),
    path('currentOrdersToOrders/<int:id>', views.currentOrdersToOrders, name='currentOrdersToOrders'),
]
