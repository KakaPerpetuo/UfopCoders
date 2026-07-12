from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# ─────────────────────────────────────────────
# MANAGER customizado para User
# ─────────────────────────────────────────────
class UserManager(BaseUserManager):
    def create_user(self, email, nome, password=None, **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        email = self.normalize_email(email)
        user = self.model(email=email, nome=nome, **extra_fields)
        user.set_password(password)  # gera o hash (bcrypt por padrão no Django)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nome, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, nome, password, **extra_fields)


# ─────────────────────────────────────────────
# 1. USER  (Usuario no diagrama)
# ─────────────────────────────────────────────
class User(AbstractBaseUser, PermissionsMixin):
    """
    Model principal de autenticação.
    Login feito por e-mail (não por username).
    O campo `password` (hash) é herdado do AbstractBaseUser.
    """
    nome        = models.CharField(max_length=150)
    email       = models.EmailField(unique=True)
    bio         = models.TextField(blank=True, null=True)
    foto_perfil = models.URLField(blank=True, null=True)  # armazena a URL da imagem
    criado_em   = models.DateTimeField(auto_now_add=True)
    cargo       = models.CharField(max_length=150, blank=True, null=True)

    # Obrigatórios pelo sistema de admin do Django
    is_active = models.BooleanField(default=True)
    is_staff  = models.BooleanField(default=False)

    # Habilidades do usuário → N:N com Tag (tabela intermediária: UserTag)
    tags = models.ManyToManyField(
        "Tag",
        through="UserTag",
        related_name="users",
        blank=True,
    )

    objects = UserManager()

    USERNAME_FIELD  = "email"   # usado no login
    REQUIRED_FIELDS = ["nome"]  # pedido no createsuperuser

    class Meta:
        db_table = "users"
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        return f"{self.nome} <{self.email}>"


# ─────────────────────────────────────────────
# 2. TAG  (Features no diagrama)
# ─────────────────────────────────────────────
class Tag(models.Model):
    """
    Competências/tecnologias — ex: React, Python, UI/UX.
    Usada tanto por User (habilidades) quanto por Project (requisitos).
    """
    nome = models.CharField(max_length=100, unique=True)
    logo = models.URLField(blank=True, null=True)  # URL do ícone da tecnologia

    objects = models.Manager()

    class Meta:
        db_table = "tags"
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

    def __str__(self):
        return str(self.nome)


# ─────────────────────────────────────────────
# 3. PROJECT  (Projeto no diagrama)
# ─────────────────────────────────────────────
class Project(models.Model):
    """
    Projeto criado por um User (dono).
    `ativo=False` arquiva o projeto sem deletar.
    """
    dono      = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="projects",  # acesso: user.projects.all()
    )
    titulo    = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    numero_membros = models.PositiveIntegerField(default=1)

    # Requisitos do projeto → N:N com Tag (tabela intermediária: ProjectTag)
    tags = models.ManyToManyField(
        Tag,
        through="ProjectTag",
        related_name="projects",
        blank=True,
    )

    objects = models.Manager()

    class Meta:
        db_table = "projects"
        verbose_name = "Projeto"
        verbose_name_plural = "Projetos"

    def __str__(self):
        return str(self.titulo)


# ─────────────────────────────────────────────
# 4. MEMBERSHIP  (Adesão no diagrama)
#    Entidade associativa explícita: User <-> Project
# ─────────────────────────────────────────────
class Membership(models.Model):
    """
    Controla o fluxo de candidatura de um User a um Project.
    É uma entidade explícita (não ManyToManyField simples) porque
    carrega `status` e `candidatado_em` como dados da relação.
    """
    class Status(models.TextChoices):
        PENDENTE = "pendente", "Pendente"
        APROVADO = "aprovado", "Aprovado"
        RECUSADO = "recusado", "Recusado"

    usuario        = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="memberships",  # acesso: user.memberships.all()
    )
    projeto        = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="memberships",  # acesso: project.memberships.all()
    )
    status         = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDENTE,
    )
    candidatado_em = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    class Meta:
        db_table = "memberships"
        unique_together = ("usuario", "projeto")  # impede candidatura duplicada
        verbose_name = "Candidatura"
        verbose_name_plural = "Candidaturas"

    def __str__(self):
        return f"{self.usuario} → {self.projeto} [{self.status}]"


# ─────────────────────────────────────────────
# 5. LINK  (entidade de suporte — 1:N com Project)
# ─────────────────────────────────────────────
class Link(models.Model):
    """Links externos de um projeto (GitHub, Figma, deploy, etc.)"""
    projeto      = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="links",  # acesso: project.links.all()
    )
    url          = models.URLField()
    nome_do_link = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "links"
        verbose_name = "Link"
        verbose_name_plural = "Links"

    def __str__(self):
        return str(self.nome_do_link or self.url)


# ─────────────────────────────────────────────
# TABELAS INTERMEDIÁRIAS das relações N:N com Tag
# ─────────────────────────────────────────────
class UserTag(models.Model):
    """UsuarioFeatures no diagrama — habilidades que o usuário possui."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tag  = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        db_table = "user_tags"
        unique_together = ("user", "tag")


class ProjectTag(models.Model):
    """ProjetoFeatures no diagrama — tecnologias que o projeto exige."""
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    tag     = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        db_table = "project_tags"
        unique_together = ("project", "tag")