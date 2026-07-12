from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Project, Tag

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Usamos 'nome' para bater exatamente com a tabela do banco de dados
        fields = ['nome', 'email', 'password', 'bio', 'cargo'] 
        
        extra_kwargs = {
            'password': {'write_only': True},
            'bio': {'required': False},
            'cargo': {'required': False}
        }

    def create(self, validated_data):
        # O Django pega a senha, aplica a criptografia e salva tudo com segurança
        user = User.objects.create_user(**validated_data)
        return user

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'nome', 'logo']

#serve para receber as tags do request, que são apenas nomes de tags, e não objetos Tag completos
class TagInputSerializer(serializers.Serializer):
    nome = serializers.CharField()

class UserMeSerializer(serializers.ModelSerializer):
    tags  = TagSerializer(many=True, read_only=True)
    # diferente de tags, tags_input é apenas para receber os nomes das tags do request, e não para retornar as tags completas
    tags_input = TagInputSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = User
        fields = ['nome', 'email', 'bio', 'cargo', 'foto_perfil', 'tags', 'tags_input']
        read_only_fields = ['email']  # email não pode ser alterado pelo patch

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags_input', None) #pega as tags do request, se houver

        #atualiza os campos simples do usuário
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        #atualiza as tags do usuário, se houver
        if tags_data is not None:
            tag_nomes = [t['nome'] for t in tags_data]
            tags = Tag.objects.filter(nome__in=tag_nomes)
            instance.tags.set(tags)

        return instance
        
class ProjectSerializer(serializers.ModelSerializer):
    topicos = serializers.SlugRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        slug_field='nome',
        required=False,
        source='tags'
    )

    class Meta:
        model = Project
        fields = ['id', 'titulo', 'descricao', 'topicos', 'numero_membros']

    def validate(self, data):
        titulo = data.get("titulo")
        topicos = data.get('tags', [])

        erros = {}

        if not titulo or not str(titulo).strip():
            erros['titulo'] = 'O titulo não pode estar vazio.'
        
        if not topicos or len(topicos) < 1:
            erros['topicos'] = 'É preciso pelo menos um tópico para o projeto.'

        if erros:
            raise serializers.ValidationError(erros)

        return data

    
