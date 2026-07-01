import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Briefcase, FileText, Camera } from "lucide-react";
import { FetchRegisterUser } from "../../controllers/fetchRegisterUser";
import axios from "axios";

const fetchRegisterUser = new FetchRegisterUser();

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [bio, setBio] = useState("");
    const [role, setRole] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfilePhoto(file);
        const reader = new FileReader();
        reader.onloadend = () => setProfilePhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        let valido = true;

        if (!name) {
            setNameError("O nome é obrigatório");
            valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("O e-mail é obrigatório");
            valido = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("O email informado não é válido");
            valido = false;
        }

        if (!password) {
            setPasswordError("A senha é obrigatória");
            valido = false;
        } else if (password.length < 8) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres");
            valido = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("A confirmação de senha é obrigatória");
            valido = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("As senhas não coincidem");
            valido = false;
        }

        if (valido) {
            try {
                // Passo 1: cria o usuário com bio e cargo
                const response = await fetchRegisterUser.execute(name, email, password, bio, role);
                console.log("Sucesso no registro: ", response);

                // Passo 2: se tiver foto, faz login automático e sobe a foto
                if (profilePhoto) {
                    // Faz login para pegar o token
                    const loginRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/PostLogin/`, {
                        email,
                        password
                    });
                    const token = loginRes.data.access;

                    // Sobe a foto usando o token
                    const formData = new FormData();
                    formData.append('foto', profilePhoto);
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/users/upload-foto/`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }

                setTimeout(() => navigate('/login'), 2000);

            } catch (e) {
                console.log("Erro no registro: ", e);
            }
        }
    };

    return (
        <div className="dark min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="relative w-12 h-12">
                            <svg viewBox="0 0 40 40" className="w-full h-full">
                                <text
                                    x="20"
                                    y="30"
                                    fontSize="28"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    fill="#8b5cf6"
                                >
                                    UC
                                </text>
                            </svg>
                        </div>
                        <span className="text-2xl text-primary">UFOP Coders</span>
                    </Link>
                    <h2 className="text-foreground mb-2">Junte-se ao UFOP Coders</h2>
                    <p className="text-muted-foreground">Crie uma conta para começar a colaborar</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                        {/* Foto de perfil */}
                        <div className="flex flex-col items-center gap-3">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-24 h-24 rounded-full border-2 border-border bg-input flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors group"
                            >
                                {profilePhotoPreview ? (
                                    <img
                                        src={profilePhotoPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-primary hover:underline"
                            >
                                {profilePhotoPreview ? "Alterar foto" : "Adicionar foto de perfil"}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>

                        {/* Nome */}
                        <div>
                            <label htmlFor="name" className="block mb-2 text-card-foreground">
                                Nome Completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Seu nome"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block mb-2 text-card-foreground">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu.email@exemplo.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                        </div>

                        {/* Cargo */}
                        <div>
                            <label htmlFor="role" className="block mb-2 text-card-foreground">
                                Cargo <span className="text-muted-foreground text-xs">(opcional)</span>
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="role"
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="Ex: Desenvolvedor Full Stack"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="block mb-2 text-card-foreground">
                                Bio <span className="text-muted-foreground text-xs">(opcional)</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Conte um pouco sobre você..."
                                    rows={3}
                                    maxLength={200}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                />
                            </div>
                            <p className="text-muted-foreground text-xs mt-1 text-right">{bio.length}/200</p>
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block mb-2 text-card-foreground">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Crie uma senha forte"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                        </div>

                        {/* Confirmação de senha */}
                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-card-foreground">
                                Confirmação de Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua senha"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Registrar
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Já tem uma conta?{" "}
                            <Link to="/login" className="text-primary hover:underline">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}