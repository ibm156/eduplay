from django.urls import path
from . import views

urlpatterns = [
    path('badges/',      views.AllBadgesView.as_view(), name='badge-list'),
    path('badges/my/',   views.MyBadgesView.as_view(),  name='my-badges'),
    path('stats/',       views.my_stats_view,           name='my-stats'),
]
