"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from api.views import MeView
from api.views import UploadFotoPerfilView, ProjectCreateView
from api.views import TagListView
from api.views import GetProjects

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/PostLogin/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/CreateUser/', CreateUserView.as_view(), name='create_user'),

    path('api/users/me/', MeView.as_view(), name='user-me'),

    path('api/users/upload-foto/', UploadFotoPerfilView.as_view(), name='upload-foto'),

    path('api/GetProjects/', GetProjects.as_view(), name='get-projects'),

    path('api/projetos/', ProjectCreateView.as_view(), name='criar-projeto'),
    path('api/tags/', TagListView.as_view(), name='tag-list'),

]
