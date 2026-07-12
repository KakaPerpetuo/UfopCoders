import axios from 'axios';

export class FetchCandidatos {
    async execute(token, projetoId) {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/projects/${projetoId}/candidatos/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response;
        } catch (e) {
            console.error("Erro ao buscar candidatos: ", e);
        }
    }
}