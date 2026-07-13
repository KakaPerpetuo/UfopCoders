import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import ProjectCard from '../../components/ProjectCard'
import TagChips from '../../components/TagChips'
import { FetchUserMe } from '../../controllers/fetchUserMe'
import { FetchUserProjects } from '../../controllers/fetchUserProjects'
import { FetchTags } from '../../controllers/fetchTags'
import { FetchDiscoverProjects } from '../../controllers/fetchDiscoverProjects'
import { useNavigate } from 'react-router-dom'

const fetchUserMe = new FetchUserMe()
const fetchUserProjects = new FetchUserProjects()
const fetchTags = new FetchTags()
const fetchDiscoverProjects = new FetchDiscoverProjects()

export default function Discover() {
    const { token } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [userProjects, setUserProjects] = useState([])
    const [discoverProjects, setDiscoverProjects] = useState([])
    const [availableTags, setAvailableTags] = useState([])

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            const [userRes, userProjectsRes, tagsRes] = await Promise.all([
                fetchUserMe.execute(token),
                fetchUserProjects.execute(token),
                fetchTags.execute(token)
            ])

            if (userRes) setUser(userRes.data)
            if (userProjectsRes) setUserProjects(userProjectsRes.data)
            if (tagsRes) setAvailableTags(tagsRes.data)
        }
        if (token) {
            loadData()
        }
    }, [token])

    useEffect(() => {
        if (!token) return

        const delayDebounceFn = setTimeout(async () => {
            const response = await fetchDiscoverProjects.execute(token, searchTerm, selectedTags)
            if (response) {
                setDiscoverProjects(response.data.results || response.data)
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, selectedTags, token])

    const handleToggleTag = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        )
    }

    const handleSearch = async (e) => {
        if (e) e.preventDefault()

        const response = await fetchDiscoverProjects.execute(token, searchTerm, selectedTags)
        if (response) {
            setDiscoverProjects(response.data.results || response.data)
        }
    }

    if (!user) return <p className='text-gray-400 p-6'>Carregando...</p>
    return (
        <div className='dark min-h-screen bg-background flex flex-col'>
            <Header />

            <div className='flex flex-1'>
                <Sidebar user={user} projects={userProjects} />

                <main className='flex-1 p-8'>
                    <div className="flex justify-between items-center my-10 mb-20">
                        <h1 className='text-foreground text-7xl font-bold'>Projetos disponíveis</h1>
                        <button onClick={() => navigate('/createProject')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-[var(--radius)] flex items-center gap-2 transition-colors">
                            <span className="text-xl leading-none">+</span> Criar Projeto
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2 mb-4 w-full">
                        <input
                            type="text"
                            className="w-full flex-1 bg-card border border-border text-foreground placeholder-muted-foreground text-sm rounded-[var(--radius)] px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar..."
                            value={searchTerm}
                        />

                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 rounded-[var(--radius)] transition-colors"
                        >
                            Buscar
                        </button>
                    </form>

                    <TagChips tags={availableTags} selectedTags={selectedTags} onToggleTag={handleToggleTag} />

                    {user && (
                        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {discoverProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </ul>
                    )}
                </main>
            </div>
        </div>
    )
}