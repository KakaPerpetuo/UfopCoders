import Header from '../../components/Header'
import { FaArrowLeft } from "react-icons/fa";

export default function CreateProject() {
    return(
        <div className='dark min-h-screen bg-[#09080f] flex flex-col'>
            <Header />

            <div className='flex flex-1'>
                <main className='flex flex-1 items-center justify-start flex-col p-8 '>
                    <button
                        className='text-gray-200 gap-2 hover:-translate-y-1 transition-transform flex items-center justify-center'    
                    >
                        <FaArrowLeft/>
                        Voltar a Projetos
                    </button>
                    
                </main>
            </div>
        </div>
    );
}