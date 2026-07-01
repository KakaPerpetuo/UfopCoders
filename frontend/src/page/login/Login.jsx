import React, { useState } from "react";
import { Mail, Lock } from 'lucide-react';
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { FetchUserAuthentication } from "../../controllers/fetchUserAutentication";
import { useNavigate } from 'react-router-dom';

const fetchUserAutentication = new FetchUserAuthentication();

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { token, loading, login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        let valido = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("O email é obrigatório")
            valido = false;
        }
        if (!password) {
            setPasswordError("A senha é obrigatória")
            valido = false;
        }
        if (!emailRegex.test(email)) {
            setEmailError("O email informado não é válido")
            valido = false;
        }
        if (password.length < 8) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres")
            valido = false;
        }
        if (valido) {

            try {
                console.log("Login:", email, password);

                const response = await fetchUserAutentication.execute(email, password);

                console.log("Sucesso na autenticação. Resposta: ", response);

                login(response.data.access);

                navigate('/dashboard');

            } catch (e) {
                console.log("Erro na autenticação: ", e);
            }
        }
    }
    return (
        <div className="min-h-screen bg-[#09080f] text-white flex flex-col justify-center items-center p-4 font-sans">

            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-2">
                    <span className="text-4xl text-[#8b5cf6] px-2 py-0.5 rounded">UC</span>
                    <span className="text-[#8b5cf6] font-normal ">UFOP Coders</span>
                </div>
                <h1 className="text-xl font-semibold mt-4">Bem-vindo de volta</h1>
                <p className="text-gray-400 text-sm mt-1">Faça login para continuar codando juntos</p>
            </div>

            <div className="w-full max-w-md bg-[#14121f] border border-gray-800/50 rounded-xl p-8 shadow-2xl">
                <form className="space-y-6" onSubmit={handleLogin}>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder="seu email"
                                className="w-full bg-[#1b1929] border border-gray-700/60 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">Senha</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full bg-[#1b1929] border border-gray-700/60 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                        </div>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300 select-none">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded bg-[#1b1929] border border-gray-700/60 checked:bg-[#8b5cf6] checked:border-[#8b5cf6] focus:ring-[#8b5cf6] focus:ring-offset-0 focus:ring-1 appearance-none cursor-pointer transition-colors"
                            />
                            Manter conectado
                        </label>
                        <a href="#" className="text-[#7c3aed] hover:text-[#9061f9] transition-colors font-medium">
                            Esqueceu senha?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-[#8b5cf6]/20 active:scale-[0.99] transform"
                    >
                        Login
                    </button>
                </form>

                {/* Footer do Card */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <a href="#" className="text-[#7c3aed] hover:text-[#9061f9] transition-colors font-medium"
                    onClick={() => navigate("/register")}>
                        Cadastrar
                    </a>
                </p>
            </div>

        </div>
    )
}