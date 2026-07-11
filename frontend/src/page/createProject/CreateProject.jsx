import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import CreateProjectForm from '../../components/CreateProjectForm'
import { FetchUserMe } from '../../controllers/fetchUserMe'

const fetchUserMe = new FetchUserMe()

export default function CreateProject() {
    const { token } = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadData() {
            const userRes = await fetchUserMe.execute(token)
            if (userRes) setUser(userRes.data)
        }
        if (token) loadData()
    }, [token])

    const handleCancel = () => {
        // Redireciona de volta quando clica em Cancelar
        navigate(-1) 
    }

    // if (!user) return <p className='text-gray-400 p-6'>Carregando...</p>

    return (
        <div className='dark min-h-screen bg-background flex flex-col'>
            <Header />

            <main className='flex-1 p-8 flex items-center justify-center'>
                <CreateProjectForm onCancel={handleCancel} />
            </main>
        </div>
    )
}
