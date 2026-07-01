#from django.shortcuts import render
import uuid
from supabase import create_client
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from django.db.models import Q
from .serializers import UserSerializer, UserMeSerializer, ProjectSerializer, TagSerializer
from .models import Project
from .models import Tag

User = get_user_model()

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # AllowAny é CRUCIAL aqui: significa que a pessoa NÃO precisa estar logada para criar uma conta
    permission_classes = [AllowAny]

# modifica para RetrieveUpdateAPIView para permitir PATCH
class MeView(RetrieveUpdateAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [IsAuthenticated]
    # bloqueia put e só permite get e patch
    http_method_names = ['get', 'patch']

    def get_object(self):
        # Retorna o usuário logado (self.request.user)
        return self.request.user


class UploadFotoPerfilView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        arquivo = request.FILES.get('foto')
        if not arquivo:
            return Response({"erro": "Nenhum arquivo enviado"}, status=400)

        extensao = arquivo.name.split('.')[-1]
        nome_arquivo = f"{request.user.id}_{uuid.uuid4()}.{extensao}"

        supabase.storage.from_("avatars").upload(
            nome_arquivo,
            arquivo.read(),
            {"content-type": arquivo.content_type}
        )

        url_publica = supabase.storage.from_("avatars").get_public_url(nome_arquivo)

        request.user.foto_perfil = url_publica
        request.user.save()

        return Response({"foto_perfil": url_publica})

class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(dono=self.request.user)
# endpoint para listar todas as tags disponíveis
class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all().order_by('nome')
    serializer_class = TagSerializer
    permission_classes = [AllowAny]  # qualquer pessoa pode ver as tags

#endpoint para trazer todos os projetos do usuario
class GetProjects(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Começa com os projetos do usuário autenticado
        queryset = Project.objects.filter(dono=self.request.user)

        # Obtém os parâmetros da URL
        search = self.request.query_params.get("search")
        tag = self.request.query_params.get("tags")

        # Filtra por título ou descrição
        if search:
            queryset = queryset.filter(
                Q(titulo__icontains=search) |
                Q(descricao__icontains=search)
            )

        # Filtra por tag
        if tag:
            queryset = queryset.filter(tags__id=tag)

        # Evita projetos repetidos quando houver JOIN com tags
        return queryset.distinct()
            
            

