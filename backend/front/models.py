from django.db import models

class CurrentOrders(models.Model):
    created_at = models.DateTimeField(primary_key=True)
    product_id = models.IntegerField()
    user_id = models.IntegerField()
    quantity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'currentOrders'


class Orders(models.Model):
    user_id = models.IntegerField()
    product_id = models.IntegerField()
    quantity = models.IntegerField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'orders'

class Products(models.Model):
    image = models.CharField(max_length=255, blank=True, null=True)
    item_name = models.CharField(unique=True, max_length=255)
    description = models.CharField(max_length=255)
    price =  models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'products'


class Roles(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'roles'


class Users(models.Model):
    username = models.CharField(max_length=255)
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    role = models.ForeignKey(Roles, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'users'
