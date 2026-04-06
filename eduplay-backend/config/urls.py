from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/',     include('apps.users.urls')),
    path('api/',          include('apps.content.urls')),
    path('api/games/',    include('apps.games.urls')),
    path('api/progress/', include('apps.progress.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
