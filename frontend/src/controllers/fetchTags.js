import api from './api';

// busca tags cadastradas no banco de dados
export class FetchTags {
    async execute() {
        try {
            const response = await api.get(`/api/tags/`);
            return response;
        } catch (error) {
            console.error("Erro ao buscar tags: ", error);
        }
    }
}