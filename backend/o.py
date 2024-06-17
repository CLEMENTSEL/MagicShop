# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Currentorders(models.Model):
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
    created_at = models.DateField()

    class Meta:
        managed = False
        db_table = 'orders'


class Products(models.Model):
    image = models.CharField(max_length=255, blank=True, null=True)
    item_name = models.CharField(unique=True, max_length=255)
    description = models.CharField(max_length=255)
    price = models.CharField(max_length=255)

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
