export default function Sidebar({ user, projects }) {
    return (
        <aside className="bg-sidebar border border-sidebar-border rounded-[var(--radius)] p-5 w-80 flex flex-col gap-4">

            {/* Avatar + nome */}
            <div className="flex flex-col items-center gap-2 pb-4 border-b border-border">
                <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xl overflow-hidden">
                    {user.foto_perfil ? (
                        <img src={user.foto_perfil} alt={user.nome} className="w-full h-full object-cover" />
                    ) : (
                        <span>{'</>'}</span>
                    )}
                </div>
                <div className="text-center">
                    <h2 className="text-sidebar-foreground">{user.nome}</h2>
                    <p className="text-muted-foreground text-sm">{user.cargo ?? 'Sem cargo'}</p>
                </div>
            </div>

            {/* Interesses */}
            <div>
                <h4 className="text-muted-foreground uppercase tracking-wide mb-2">Meus interesses</h4>
                <div className="flex flex-wrap gap-1.5">
                    {user.tags?.map(tag => (
                        <span key={tag.id} className="text-sm px-3 py-1.5 rounded-full bg-accent text-accent-foreground">
                            {tag.nome}
                        </span>
                    ))}
                </div>
            </div>

            {/* Projetos */}
            <div>
                <h4 className="text-muted-foreground uppercase tracking-wide mb-2">Meus Projetos</h4>
                <div className="flex flex-col gap-1.5">
                    {projects?.map(project => (
                        <div key={project.id} className="bg-secondary border border-border rounded-[var(--radius)] px-3 py-2">
                            <p className="text-sm text-secondary-foreground">{project.titulo}</p>
                            <span className="text-xs text-muted-foreground">{project.numero_membros} membros</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card de contagem */}
            <div className="bg-secondary border border-primary rounded-[var(--radius)] px-5 py-5 mt-auto">
                <p className="text-sm text-muted-foreground mb-2">Projetos realizados</p>
                <strong className="text-2xl text-primary">{projects?.length ?? 0}</strong>
            </div>

        </aside>
    )
}