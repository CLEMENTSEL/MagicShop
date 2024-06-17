from rest_framework import serializers
from .models import Users, Products, Orders, CurrentOrders

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'

class CurrentOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentOrders
        fields = '__all__'