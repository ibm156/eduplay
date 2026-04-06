from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'school_level', 'year_group', 'avatar',
            'xp', 'level', 'streak',
        ]
        read_only_fields = ['id', 'xp', 'level', 'streak']


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=4)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'password', 'password2', 'role', 'school_level', 'year_group', 'avatar',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Include user data in the login response alongside tokens."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
