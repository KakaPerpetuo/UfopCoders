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
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q, Count
from django.core.exceptions import ObjectDoesNotExist
from .serializers import UserSerializer, UserMeSerializer, ProjectSerializer, TagSerializer, ProjectDetailSerializer, MembershipSerializer
from .models import Project, Tag, Membership
from django.shortcuts import get_object_or_404


User = get_user_model()

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id' # Faz com que a URL busque pelo campo "id"

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
        tags_raw = self.request.query_params.getlist("tags")
        tags_param = []
        for t in tags_raw:
            if t.strip():
                tags_param.extend([x.strip() for x in t.split(",") if x.strip()])

        # Filtra por título ou descrição
        if search:
            queryset = queryset.filter(
                Q(titulo__icontains=search) |
                Q(descricao__icontains=search)
            )

        # Filtra por tag (AND - o projeto precisa ter todas as tags selecionadas)
        if tags_param:
            for tag_id in tags_param:
                queryset = queryset.filter(tags__id=tag_id)

        # Evita projetos repetidos quando houver JOIN com tags
        return queryset.distinct()
            
class DiscoverProjectsPagination(PageNumberPagination):
    page_size = 12

class DiscoverProjectsView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DiscoverProjectsPagination

    def get_queryset(self):
        # Começa com todos os projetos, exceto os do usuário autenticado
        queryset = Project.objects.all()
        # Obtém os parâmetros da URL
        search = self.request.query_params.get("search")
        tags_raw = self.request.query_params.getlist("tags")
        tags_param = []
        for t in tags_raw:
            if t.strip():
                tags_param.extend([x.strip() for x in t.split(",") if x.strip()])

        # Filtra por título ou descrição
        if search:
            queryset = queryset.filter(
                Q(titulo__icontains=search) |
                Q(descricao__icontains=search)
            )

        # Filtra por tag (AND - o projeto precisa ter todas as tags selecionadas)
        if tags_param:
            for tag_id in tags_param:
                queryset = queryset.filter(tags__id=tag_id)

        # Obtém os IDs de tags do usuário logado
        user_tag_ids = self.request.user.tags.values_list('id', flat=True)

        # Ordena projetos por quantidade de tags em comum com as tags do usuário logado.
        # Projetos sem nenhuma tag em comum aparecem por último.
        queryset = queryset.annotate(
            tags_in_comum=Count('tags', filter=Q(tags__id__in=user_tag_ids))
        )

        # Evita projetos repetidos quando houver JOIN com tags
        return queryset.distinct().order_by('-tags_in_comum', '-numero_membros')

class ListarCandidatosView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MembershipSerializer

    def get_queryset(self):
        projeto_id = self.kwargs['projeto_id']

        try:
            projeto = Project.objects.get(id=projeto_id)
        except ObjectDoesNotExist:
            raise PermissionDenied("Projeto não encontrado.")

        if projeto.dono != self.request.user:
            raise PermissionDenied("Apenas o dono do projeto pode ver os candidatos.")

        return Membership.objects.filter(
            projeto_id=projeto_id,
            status='pendente'
        )

class AtualizarCandidatoView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, projeto_id, membership_id):
        try:
            projeto = Project.objects.get(id=projeto_id)
        except ObjectDoesNotExist:
            return Response({"erro": "Projeto não encontrado."}, status=404)

        # Só o dono pode aprovar/rejeitar
        if projeto.dono != request.user:
            raise PermissionDenied("Apenas o dono do projeto pode atualizar candidatos.")

        try:
            membership = Membership.objects.get(id=membership_id, projeto=projeto)
        except ObjectDoesNotExist:
            return Response({"erro": "Candidatura não encontrada."}, status=404)

        novo_status = request.data.get('status')
        if novo_status not in ['aprovado', 'recusado']:
            return Response({"erro": "Status inválido. Use 'aprovado' ou 'recusado'."}, status=400)

        membership.status = novo_status
        membership.save()

        return Response(MembershipSerializer(membership).data)
class ProjectJoinView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        projeto = get_object_or_404(Project, id=id)
        
        if projeto.dono == request.user:
            return Response({'erro': "Você não pode se candidatar ao seu próprio projeto."})
        
        if Membership.objects.filter(projeto=projeto, usuario=request.user).exists():
            return Response({'erro': "Você já é membro deste projeto."})
        
        Membership.objects.create(projeto=projeto, usuario=request.user)

        return Response({'mensagem': "Candidatura enviada com sucesso!"})
