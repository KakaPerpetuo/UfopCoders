import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
    const { id, titulo, descricao, topicos, numero_membros } = project;

    return (
        <li className="bg-card border border-border rounded-[var(--radius)] p-6 flex flex-col justify-between hover:border-primary transition-all duration-200">
            <div>
                <h3 className="text-foreground text-xl font-semibold mt-1 mb-2">{titulo}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{descricao}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {topicos?.map((tag, index) => (
                        <span
                            key={index}
                            className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Rodapé: Membros & Ação */}
            <div className="flex flex-col gap-4 pt-4 border-t border-border mt-auto">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">Membros ativos</span>
                    <span className="text-xs text-foreground font-semibold">
                        {numero_membros}
                    </span>
                </div>

                <Link
                    to={`/projeto/${id}`}
                    className="w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 rounded-[var(--radius)] transition-colors transform transition-transform duration-300 hover:scale-105"
                >
                    Quero participar
                </Link>
            </div>
        </li>
    )
}
