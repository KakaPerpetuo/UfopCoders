import { useState } from 'react';
import Header from '../../components/Header'
import { FaArrowLeft } from "react-icons/fa";
import ProjectTags from './ProjectTags';

export default function CreateProject() {

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);

    return(
        <div className='dark min-h-screen bg-[#09080f] flex flex-col'>
            <Header />

            <div className='flex flex-1'>
                <main className='flex flex-1 items-center justify-start flex-col px-8 '>
                    
                    <div>
                        
                        <button
                        className='text-gray-200 mt-3 gap-2 hover:-translate-y-1 transition-transform flex items-center justify-center'    
                        >
                            <FaArrowLeft/>
                            Voltar a Projetos
                        </button>
                        
                        <div className='text-white flex flex-col py-6 px-8 gap-4 border border-border w-[820px] h-[530px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 mt-3 bg-card rounded-md'>
                            <h1>Crie um Novo Projeto</h1>
                            
                            <div className='flex flex-col gap-2'>
                                <h4>Titulo do Projeto:</h4>
                                <input
                                    type="text"
                                    placeholder="Digite o titulo do projeto"
                                    className="w-full bg-[#1b1929] border border-gray-700/60 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <h4>Descrição:</h4>
                                <textarea
                                    type="text"
                                    placeholder="Descreva seu projeto, seus objetivos e o que você está procurando construir."
                                    className="w-full h-40 bg-[#1b1929] border text-left border-gray-700/60 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <h4>Tecnologias & Tópicos:</h4>
                                <h5 className='text-gray-500'>Selecione as tags que descrevem seu projeto da melhor forma:</h5>
                                <ProjectTags/>
                            </div>

                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}