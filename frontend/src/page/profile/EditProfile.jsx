import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { FetchUserMe } from '../../controllers/fetchUserMe'
import { FetchPatchUserMe } from '../../controllers/fetchPatchUserMe'
import { FetchTags } from '../../controllers/fetchTags'
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/Header'
import { FetchUploadFoto } from '../../controllers/fetchUploadFoto'
import { useRef } from 'react'



const fetchUserMe = new FetchUserMe()
const fetchPatchUserMe = new FetchPatchUserMe()
const fetchTags = new FetchTags()
const fetchUploadFoto = new FetchUploadFoto()

export default function Profile() {
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [user, setUser] = useState(null)
    const [todasTags, setTodasTags] = useState([])
    const [tagsSelecionadas, setTagsSelecionadas] = useState([])
    const [nome, setNome] = useState('')
    const [bio, setBio] = useState('')
    const [cargo, setCargo] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [fotoPreview, setFotoPreview] = useState(null)
    const [fotoArquivo, setFotoArquivo] = useState(null)

    useEffect(() => {
        async function load() {
            const [resUser, resTags] = await Promise.all([
                fetchUserMe.execute(token),
                fetchTags.execute(),
            ])
            if (resUser) {
                setUser(resUser.data)
                setNome(resUser.data.nome || '')
                setBio(resUser.data.bio || '')
                setCargo(resUser.data.cargo || '')
                setTagsSelecionadas(resUser.data.tags?.map(t => t.nome) || [])
            }
            if (resTags) {
                setTodasTags(resTags.data)
            }
        }
        if (token) load()
    }, [token])

    function toggleTag(nome) {
        setTagsSelecionadas(prev =>
            prev.includes(nome)
                ? prev.filter(t => t !== nome)
                : [...prev, nome]
        )
    }

    async function handleSalvar() {
        if (fotoArquivo) {
            await fetchUploadFoto.execute(token, fotoArquivo)
        }
        const data = {
            nome,
            bio,
            cargo,
            tags_input: tagsSelecionadas.map(n => ({ nome: n })),
        }
        const res = await fetchPatchUserMe.execute(token, data)
        if (res) {
            setMensagem('Perfil atualizado com sucesso!')
            setTimeout(() => navigate('/profile'), 1500)
        }
    }

    function handleFotoChange(e) {
        const arquivo = e.target.files?.[0]
        console.log('arquivo selecionado:', arquivo)
        if (arquivo) {
            setFotoArquivo(arquivo)
            setFotoPreview(URL.createObjectURL(arquivo))
        }
    }

    if (!user) return <p className='text-gray-400 p-6'>Carregando...</p>

    return (
        <div className="dark min-h-screen bg-[#0a0a0f]">
            <Header />
            <div className="max-w-2xl mx-auto px-6 py-8">
                <button
                    onClick={() => navigate('/profile')}
                    className="
                        flex items-center gap-2
                        text-gray-400 hover:text-white
                        mb-8 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                </button>
                <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800 shadow-xl w-full">
                    <h1 className='text-white text-2xl'>Editar Perfil</h1>
                    {/* Foto de perfil */}
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-24 h-24 rounded-full border-2 border-gray-700 bg-primary/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-violet-500 transition-colors group"
                        >
                            {fotoPreview || user.foto_perfil ? (
                                <img
                                    src={fotoPreview || user.foto_perfil}
                                    alt="foto de perfil"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-primary text-xl">{'</>'}</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs">Alterar</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            {fotoPreview || user.foto_perfil ? 'Alterar foto' : 'Adicionar foto'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFotoChange}
                        />
                    </div>

                    {/* Campos simples */}
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-muted-foreground text-sm'>Nome</label>
                            <input
                                className='bg-secondary border border-border rounded-[var(--radius)] px-3 py-2 text-white'
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-muted-foreground text-sm'>Cargo</label>
                            <input
                                className='bg-secondary border border-border rounded-[var(--radius)] px-3 py-2 text-white'
                                value={cargo}
                                onChange={e => setCargo(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-muted-foreground text-sm'>Bio</label>
                            <textarea
                                className='bg-secondary border border-border rounded-[var(--radius)] px-3 py-2 text-white resize-none'
                                rows={3}
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Chips de tags */}
                    <div className="space-y-3 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-white">
                                Hard skills e interesses
                            </label>

                            <p className="text-xs text-gray-400 mt-1">
                                Selecione as tecnologias que você domina ou deseja explorar.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {todasTags.map(tag => {
                                const active = tagsSelecionadas.includes(tag.nome);

                                return (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag.nome)}
                                        className={`
                                            inline-flex items-center gap-1.5
                                            px-3 py-1.5
                                            rounded-full
                                            text-sm font-medium
                                            transition-all duration-200
                                            ${
                                                active
                                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                                                    : 'bg-transparent border border-gray-700 text-gray-400 hover:border-violet-500 hover:text-white'
                                            }
                                        `}
                                    >
                                        {active && "✓"}
                                        {tag.nome}
                                    </button>
                                )
                            })}
                        </div>

                        {tagsSelecionadas.length > 0 && (
                            <p className="text-xs text-gray-400">
                                {tagsSelecionadas.length} skill
                                {tagsSelecionadas.length !== 1 ? 's' : ''}
                                {' '}selecionada
                                {tagsSelecionadas.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-6">
                        <button
                            onClick={handleSalvar}
                            className="
                                flex-1
                                py-3
                                rounded-lg
                                font-medium
                                bg-violet-600
                                text-white
                                hover:bg-violet-500
                                transition-all
                                active:scale-[0.98]
                            "
                        >
                            Salvar
                        </button>

                        <button
                            onClick={() => navigate('/profile')}
                            className="
                                px-6
                                py-3
                                rounded-lg
                                border border-gray-700
                                text-gray-400
                                hover:text-white
                                hover:border-violet-500
                                hover:bg-[#24243a]
                                transition-all
                            "
                        >
                            Cancelar
                        </button>
                    </div>
                    {mensagem && <p className='text-green-400 text-sm'>{mensagem}</p>}
                </div>
            </div>
        </div>
    )
}