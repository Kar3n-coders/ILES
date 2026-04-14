from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import CustomUser

class UserProfileSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(
        source='get_role_display',
        read_only=True
    )

class Meta:
    model = CustomUser
    fields = [
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'role',
        'role_display',
        'phone_number',
        'university',
        'course',
        'department',
        'date_joined',
    ]

    read_only_fields = ['id', 'date-joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

class Meta:
    model = CustomUser
    fields = [
        'username',
        'email',
        'password',
        'password_confirm',
        'first_name',
        'last_name',
        'role',
        'phone_number',
        'university',
        'course',
        'department',
    ]

def validate_password(self, value):
    try:
        validate_password(value)
    except DjangoValidationError as e:
        raise serializers.ValidationError(list(e.messages))
    return value

def validate(self, data):
    if data['password'] != data['password_confirm']:
        raise serializers.ValidationError({
            "password_confirm": "Passwords do not match."
        })
    return data 

def create(self, validated_data):
    validated_data.pop('password_confirm')
    password = validated_data.pop('password')
    user = CustomUser.objects.create_user(
        password=password,
        **validated_data
    )
    return user


