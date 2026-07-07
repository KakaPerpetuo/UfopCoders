import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Sidebar from '../../components/Sidebar'
import { FetchUserMe } from '../../controllers/fetchUserMe' // se precisar buscar dados do usuário logado
import { FetchUserProjects } from '../../controllers/fetchUserProjects'
import { FetchTags } from '../../controllers/fetchTags'
import { GetUserProjects } from '../../controllers/getUserProjects'

//TODO mudar para real depois
// const fetchUserProjects = new FetchUserProjects()
const getUserProjects = new GetUserProjects()

const fetchUserMe = new FetchUserMe()
const fetchTags = new FetchTags()


export default function Discover() {
    const { token } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [projects, setProjects] = useState([])
    const [availableTags, setAvailableTags] = useState([])

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTag, setSelectedTag] = useState(null)

    useEffect(() => {
        async function loadData() {
            const [userRes, projectRes, tagsRes] = await Promise.all([
                fetchUserMe.execute(token),
                getUserProjects.execute(),
                fetchTags.execute(token)
            ])

            if (userRes) setUser(userRes.data)

            if (projectRes) setProjects(projectRes.data)

            if (tagsRes) setAvailableTags(tagsRes.data)
        }
        if (token) {
            loadData()
        }
    }, [token])


    const handleSelectTag = (tagId) => {
        setSelectedTag(prevSelected => (prevSelected === tagId ? null : tagId))
    }

    const handleSearch = async (e) => {
        if (e) e.preventDefault()

        const response = await getUserProjects.execute(searchTerm, selectedTag)
        if (response) {
            setProjects(response.data)
        }
    }

    if (!user) return <p className='text-gray-400 p-6'>Carregando...</p>
    return (
        <div className='dark min-h-screen bg-background flex'>
            {/* Mantém a Sidebar padrão */}
            <Sidebar user={user} projects={projects} />

            <main className='flex-1 p-8'>
                <h1 className='text-foreground text-4xl font-bold mb-4'>Descubra Projetos</h1>

                <form onSubmit={handleSearch} className="flex gap-2 mb-6 w-full max-w-lg">
                    <input
                        type="text"
                        className="w-full flex-1 my-4 bg-card border border-border text-foreground placeholder-muted-foreground text-sm rounded-[var(--radius)] px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar..."
                        value={searchTerm}
                    />

                    <button
                        type="submit" // <-- Garante que submete o formulário ao clicar
                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 rounded-[var(--radius)] transition-colors"
                    >
                        Buscar
                    </button>

                </form>



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