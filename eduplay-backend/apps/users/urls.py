from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('token/',          views.LoginView.as_view(),   name='token_obtain_pair'),
    path('token/refresh/',  TokenRefreshView.as_view(),  name='token_refresh'),
    path('register/',       views.RegisterView.as_view(), name='register'),
    path('logout/',         views.logout_view,           name='logout'),
    path('me/',             views.me_view,               name='me'),
    path('users/',          views.UserListView.as_view(), name='user_list'),
]
