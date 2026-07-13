import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { FetchUserMe } from '../../controllers/fetchUserMe'
import { FetchUserProjects } from '../../controllers/fetchUserProjects'
import { FetchCandidatos } from '../../controllers/fetchCandidatos'
import { AtualizarCandidato } from '../../controllers/atualizarCandidato'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { Check, X } from 'lucide-react'

const fetchUserMe = new FetchUserMe()
const fetchUserProjects = new FetchUserProjects()
const fetchCandidatos = new FetchCandidatos()
const atualizarCandidato = new AtualizarCandidato()

export default function PainelDono() {
    const { token } = useContext(AuthContext)
    const { projetoId } = useParams()
    const [user, setUser] = useState(null)
    const [projects, setProjects] = useState([])
    const [candidatos, setCandidatos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                const [userRes, projectsRes, candidatosRes] = await Promise.all([
                    fetchUserMe.execute(),
                    fetchUserProjects.execute(),
                    fetchCandidatos.execute(projetoId) 
                ]);
                
                if (userRes) setUser(userRes.data);
                if (projectsRes) setProjects(projectsRes.data);
                if (candidatosRes) setCandidatos(candidatosRes.data);
                
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
            } finally {
                setLoading(false);
            }
        }
        if (token) loadData(); 
    }, [token, projetoId]);

    async function handleAtualizarStatus(membershipId, status) {
        const res = await atualizarCandidato.execute(projetoId, membershipId, status)
        if (res) {
            // Remove o candidato da lista após aprovar/rejeitar
            setCandidatos(prev => prev.filter(c => c.id !== membershipId))
        }
    }

    if (loading || !user) return <p className='text-gray-400 p-6'>Carregando...</p>

    return (
        <div className='dark min-h-screen bg-[#09080f] flex flex-col'>
            <Header />
            <div className='flex flex-1'>
                <Sidebar user={user} projects={projects} />
                <main className='flex-1 p-8'>
                    <h1 className='text-white mb-6'>Painel de Candidatos</h1>

                    {candidatos.length === 0 ? (
                        <p className='text-muted-foreground'>Nenhum candidato pendente.</p>
                    ) : (
                        <div className='flex flex-col gap-4'>
                            {candidatos.map(candidatura => (
                                <div
                                    key={candidatura.id}
                                    className='bg-card border border-border rounded-lg p-5 flex items-center gap-4'
                                >
                                    {/* Foto */}
                                    <div className='w-14 h-14 rounded-full bg-accent flex items-center justify-center overflow-hidden shrink-0'>
                                        {candidatura.usuario.foto_perfil ? (
                                            <img
                                                src={candidatura.usuario.foto_perfil}
                                                alt={candidatura.usuario.nome}
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <span className='text-accent-foreground'>{'</>'}</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className='flex-1'>
                                        <p className='text-card-foreground font-medium'>
                                            {candidatura.usuario.nome}
                                        </p>
                                        <p className='text-muted-foreground text-sm'>
                                            {candidatura.usuario.cargo ?? 'Sem cargo'}
                                        </p>
                                        <div className='flex flex-wrap gap-1.5 mt-2'>
                                            {candidatura.usuario.tags?.map(tag => (
                                                <span
                                                    key={tag.id}
                                                    className='text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground'
                                                >
                                                    {tag.nome}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className='flex gap-2 shrink-0'>
                                        <button
                                            onClick={() => handleAtualizarStatus(candidatura.id, 'aprovado')}
                                            className='flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                                        >
                                            <Check size={16} />
                                            Aceitar
                                        </button>
                                        <button
                                            onClick={() => handleAtualizarStatus(candidatura.id, 'recusado')}
                                            className='flex items-center gap-1.5 px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors'
                                        >
                                            <X size={16} />
                                            Rejeitar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}