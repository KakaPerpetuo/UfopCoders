import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { fetchProjectId } from '../../controllers/fetchProjectId'
import { JoinProject } from '../../controllers/fetchJoinProject'
import { FetchUserMe } from '../../controllers/fetchUserMe'
import { FetchUserProjects } from '../../controllers/fetchUserProjects'

const fetchProjectController = new fetchProjectId()
const joinProjectController = new JoinProject()
const fetchUserMe = new FetchUserMe()
const fetchUserProjects = new FetchUserProjects()

export default function ProjectDetails() {
    const { id } = useParams()
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    
    const [user, setUser] = useState(null)
    const [userProjects, setUserProjects] = useState([])
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const [joinStatus, setJoinStatus] = useState('idle')
    const [joinMessage, setJoinMessage] = useState('')

    useEffect(() => {
        async function loadData() {
            if (!token) return;
            
            try {
                // Carregar usuário e projetos (para a Sidebar) e o Projeto atual
                const [userRes, userProjectsRes, projectRes] = await Promise.all([
                    fetchUserMe.execute(),
                    fetchUserProjects.execute(),
                    fetchProjectController.execute(id)
                ])

                if (userRes) setUser(userRes.data)
                if (userProjectsRes) setUserProjects(userProjectsRes.data)
                if (projectRes) setProject(projectRes) // já retorna response.data no controller
            } catch (error) {
                console.error("Erro ao carregar os dados:", error)
            } finally {
                setLoading(false)
            }
        }
        
        loadData()
    }, [id, token])

    const handleJoin = async () => {
        setJoinStatus('loading')
        try {
            const res = await joinProjectController.execute(id)
            setJoinStatus('success')
            setJoinMessage(res.mensagem || 'Candidatura enviada com sucesso!')
        } catch (error) {
            setJoinStatus('error')
            // O axios coloca a resposta de erro em error.response
            if (error.response && error.response.data && error.response.data.erro) {
                setJoinMessage(error.response.data.erro)
            } else {
                setJoinMessage("Erro ao se candidatar. Tente novamente mais tarde.")
            }
        }
    }

    if (loading) return <p className='text-muted-foreground p-6'>Carregando detalhes...</p>
    if (!project) return <p className='text-red-500 p-6'>Projeto não encontrado.</p>

    return (
        <div className='dark min-h-screen bg-background flex flex-col'>
            <Header />

            <div className='flex flex-1'>
                <Sidebar user={user} projects={userProjects} />

                <main className='flex-1 p-8 overflow-y-auto'>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-muted-foreground hover:text-foreground mb-6 transition-colors flex items-center gap-2"
                    >
                        &larr; Voltar
                    </button>

                    <div className="bg-card border border-border rounded-[var(--radius)] p-8 max-w-4xl">
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <div>
                                <h1 className='text-foreground text-4xl font-bold mb-2'>{project.titulo}</h1>
                                <p className="text-muted-foreground text-sm">Criado por: <span className="font-semibold text-foreground">{project.dono_nome}</span></p>
                            </div>
                            
                            {/* Tags do Projeto */}
                            <div className="flex gap-2 flex-wrap max-w-sm justify-end">
                                {project.topicos?.map((tag, index) => (
                                    <span key={index} className="text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-medium">
                                        {tag.nome}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none mb-10 text-foreground">
                            <h3 className="text-xl font-semibold mb-3">Sobre o Projeto</h3>
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                {project.descricao || "Nenhuma descrição fornecida."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {/* Detalhes Técnicos */}
                            <div className="bg-background border border-border p-5 rounded-[var(--radius)]">
                                <h4 className="text-foreground font-semibold mb-4 border-b border-border pb-2">Informações</h4>
                                <ul className="space-y-3">
                                    <li className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Membros Ativos:</span>
                                        <span className="text-foreground font-medium">{project.numero_membros}</span>
                                    </li>
                                    <li className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className="text-emerald-500 font-medium">Aberto para Candidaturas</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Links */}
                            {project.links && project.links.length > 0 && (
                                <div className="bg-background border border-border p-5 rounded-[var(--radius)]">
                                    <h4 className="text-foreground font-semibold mb-4 border-b border-border pb-2">Links Úteis</h4>
                                    <ul className="space-y-3">
                                        {project.links.map((link) => (
                                            <li key={link.id} className="text-sm">
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                                    {link.nome_do_link || link.url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Área de Candidatura */}
                        <div className="flex flex-col items-start pt-6 border-t border-border">
                            {/* Opcional: Impedir dono de se candidatar */}
                            {user && user.id === project.dono_id ? (
                                <p className="text-muted-foreground italic">Você é o dono deste projeto.</p>
                            ) : (
                                <>
                                    <button 
                                        onClick={handleJoin}
                                        disabled={joinStatus === 'loading' || joinStatus === 'success'}
                                        className={`px-8 py-3 rounded-[var(--radius)] font-bold text-sm transition-all transform hover:scale-105 ${
                                            joinStatus === 'success' 
                                            ? 'bg-emerald-500 text-white cursor-default' 
                                            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                        }`}
                                    >
                                        {joinStatus === 'loading' ? 'Enviando...' : (joinStatus === 'success' ? 'Candidatura Enviada' : 'Quero participar')}
                                    </button>

                                    {joinStatus === 'success' && (
                                        <p className="mt-3 text-emerald-500 text-sm font-medium">{joinMessage}</p>
                                    )}
                                    {joinStatus === 'error' && (
                                        <p className="mt-3 text-red-500 text-sm font-medium">{joinMessage}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
