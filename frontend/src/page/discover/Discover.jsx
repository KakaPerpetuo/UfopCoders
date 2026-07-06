import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Sidebar from '../../components/Sidebar'
import { FetchUserMe } from '../../controllers/fetchUserMe' // se precisar buscar dados do usuário logado
import { FetchUserProjects } from '../../controllers/fetchUserProjects'

const fetchUserProjects = new FetchUserProjects()
const fetchUserMe = new FetchUserMe()

const MOCK_PROJECTS = [
    {
        id: 1,
        titulo: "Portal do Aluno UFOP",
        descricao: "Plataforma web para auxiliar estudantes da UFOP a gerenciarem suas matérias, notas e horários de forma integrada e moderna.",
        dono: { nome: "João Silva", cargo: "Estudante de BCC" },
        tags: [
            { id: 1, nome: "React" },
            { id: 2, nome: "Node.js" },
            { id: 3, nome: "PostgreSQL" }
        ],
        criado_em: "25/06/2026"
    },
    {
        id: 2,
        titulo: "MatchDevs",
        descricao: "Aplicativo mobile para conectar programadores da universidade com projetos de extensão que precisam de desenvolvedores.",
        dono: { nome: "Maria Souza", cargo: "Estudante de Eng. de Software" },
        tags: [
            { id: 4, nome: "Flutter" },
            { id: 5, nome: "Django" },
            { id: 6, nome: "Supabase" }
        ],
        criado_em: "28/06/2026"
    },
    {
        id: 3,
        titulo: "E-Commerce Solidário",
        descricao: "Um site para pequenos artesãos de Ouro Preto anunciarem seus produtos de forma gratuita e impulsionarem a economia local.",
        dono: { nome: "Carlos Oliveira", cargo: "Estudante de Sistemas" },
        tags: [
            { id: 7, nome: "Next.js" },
            { id: 8, nome: "Tailwind" },
            { id: 9, nome: "MongoDB" }
        ],
        criado_em: "27/06/2026"
    }
]


export default function Discover() {
    const { token } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [projects, setProjects] = useState(MOCK_PROJECTS)

    useEffect(() => {
        async function loadData() {
            const [userRes, projectRes] = await Promise.all([
                fetchUserMe.execute(token),
                fetchUserProjects.execute(token)
            ])

            if (userRes) setUser(userRes.data)

            if (projectRes) setProjects(projectRes.data)
        }
        if (token) {
            loadData()
        }
    }, [token])

    if (!user) return <p className='text-gray-400 p-6'>Carregando...</p>
    return (
        <div className='dark min-h-screen bg-background flex'>
            {/* Mantém a Sidebar padrão */}
            <Sidebar user={user} />

            <main className='flex-1 p-8'>
                <h1 className='text-foreground text-4xl font-bold mb-4'>Descubra Projetos</h1>

                {user && (
                    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="bg-card border border-border rounded-[var(--radius)] p-6 flex flex-col justify-between hover:border-primary transition-all duration-200"
                            >
                                <div>
                                    {/* <span className="text-xs text-muted-foreground">Criado em {project.criado_em}</span> */}
                                    <h3 className="text-foreground text-xl font-semibold mt-1 mb-2">{project.titulo}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{project.descricao}</p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                        {/* {project.tags.map(tag => (
                                            <span
                                                key={tag.id}
                                                className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground"
                                            >
                                                {tag.nome}
                                            </span>
                                        ))} */}
                                    </div>
                                </div>

                                {/* Criador & Ação */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div>
                                        {/* <p className="text-foreground text-xs font-medium">{project.dono.nome}</p>
                                        <p className="text-muted-foreground text-[10px]">{project.dono.cargo}</p> */}
                                    </div>
                                    <Link
                                        to={`/projeto/${project.id}`}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-[var(--radius)] transition-colors transform transition-transform duration-300 hover:scale-105"
                                    >
                                        Quero participar
                                    </Link>
                                </div>
                            </li> // <-- fecha <li>
                        ))}
                    </ul> // <-- fecha <ul>
                )}
            </main>
        </div >
    )
}