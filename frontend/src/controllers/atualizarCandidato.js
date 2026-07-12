import axios from 'axios';

export class AtualizarCandidato {
    async execute(token, projetoId, membershipId, status) {
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/projects/${projetoId}/candidatos/${membershipId}/`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response;
        } catch (e) {
            console.error("Erro ao atualizar candidato: ", e);
        }
    }
}