import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { FetchUserMe } from '../../controllers/fetchUserMe'
import { FetchUserProjects } from '../../controllers/fetchUserProjects'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { FaPlus } from "react-icons/fa";

const fetchUserMe = new FetchUserMe()
const fetchUserProjects = new FetchUserProjects()

export default function Dashboard() {
    const { token } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const [projects, setProjects] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function loadData() {
            const [userRes, projectsRes] = await Promise.all([
                fetchUserMe.execute(token),
                fetchUserProjects.execute(token)
            ])
            if (userRes) setUser(userRes.data)
            if (projectsRes) setProjects(projectsRes.data)
        }
        if (token) loadData()
    }, [token])

    if (!user) return <p className='text-gray-400 p-6'>Carregando...</p>

    return (
        <div className='dark min-h-screen bg-[#09080f] flex flex-col'>
            <Header />

            {/*Conteúdo*/}
            <div className='flex flex-1'>
                <Sidebar user={user} projects={projects} />
                <main className='flex-1 flex p-8 '>
                    <h1 className='text-white'>Explore Projetos</h1>

                    <button
                        className='w-[150px] h-[40px] flex items-center justify-center gap-2 hover:-translate-y-1 transition-transform shadow-md bg-[#8b5cf6] text-white ml-auto rounded-md'
                        onClick={() => navigate('/createProject')}
                    >
                        <FaPlus />
                        Criar Projeto
                    </button>
                </main>
            </div>
        </div>
    )
}