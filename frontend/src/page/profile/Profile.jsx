import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Pencil, Users, FolderGit2 } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { FetchUserMe } from "../../controllers/fetchUserMe";

const fetchUserMe = new FetchUserMe();

export default function Profile() {
    const { token } = useContext(AuthContext);

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function load() {
            const res = await fetchUserMe.execute(token);

            if (res) {
                setUser(res.data);
            }
        }

        if (token) load();
    }, [token]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#09080f] flex items-center justify-center text-gray-400">
                Carregando...
            </div>
        );
    }

    return (
        <div className="dark min-h-screen bg-[#09080f] flex items-start justify-center py-12 px-6">
            <div className="w-full max-w-xl space-y-6">

                {/* Cabeçalho */}
                <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-4 text-center">

                    <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 overflow-hidden flex items-center justify-center">
                        {user.foto_perfil ? (
                            <img src={user.foto_perfil} alt={user.nome} className="w-full h-full object-cover" />
                        ) : (
                            <Code2 className="w-12 h-12 text-primary" />
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            {user.nome}
                        </h1>

                        <p className="text-muted-foreground mt-1">
                            {user.cargo || "Cargo não informado"}
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                        {user.bio || "Nenhuma biografia cadastrada."}
                    </p>

                    <Link
                        to="/profile/edit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                        <Pencil className="w-4 h-4" />
                        Editar Perfil
                    </Link>
                </div>

                {/* Skills */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">
                        Hard skills e interesses
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {user.tags?.length > 0 ? (
                            user.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1.5 rounded-full bg-violet-900/50 text-violet-400 text-sm font-medium"
                                >
                                    {tag.nome}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma skill cadastrada.
                            </p>
                        )}
                    </div>
                </div>

                {/* Projetos */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-base font-semibold text-foreground">
                            Meus Projetos
                        </h2>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Nenhum projeto cadastrado ainda.
                    </div>
                </div>

            </div>
        </div>
    );
}