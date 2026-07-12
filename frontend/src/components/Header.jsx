import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Header() {
    const { token, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="border-b border-border bg-card">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                
                <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => navigate(token ? '/dashboard' : '/')}
                >
                    <div className="relative w-10 h-10">
                        <svg viewBox="0 0 40 40" className="w-full h-full">
                            <text
                                x="20"
                                y="28"
                                fontSize="24"
                                fontWeight="bold"
                                textAnchor="middle"
                                fill="#8b5cf6"
                            >
                                UC
                            </text>
                        </svg>
                    </div>
                    <span className="text-primary font-medium">UFOP Coders</span>
                </div>

                <div className="flex gap-3">
                    {token ? (
                        <>
                            <button 
                                onClick={() => navigate('/painelDono/:projetoId')}
                                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
                            >
                                Painel
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
                
            </div>
        </header>
    )
}