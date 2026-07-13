import api from './api';

export class FetchCandidatos {
    async execute(projetoId) {
        try {
            const response = await api.get(
                `/api/projects/${projetoId}/candidatos/`
            );
            return response;
        } catch (e) {
            console.error("Erro ao buscar candidatos: ", e);
            throw e;
        }
    }
}