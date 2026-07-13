import api from './api';

export class FetchDiscoverProjects {
    async execute(token, search, tags, page = 1) {
        const params = { page };
        if (search) {
            params.search = search;
        }
        if (tags && (Array.isArray(tags) ? tags.length > 0 : true)) {
            params.tags = Array.isArray(tags) ? tags.join(',') : tags;
        }
        try {
            const response = await api.get(`/api/projects/`, {
                params: params
            });
            return response;
        } catch (e) {
            console.error("Erro ao buscar projetos para descoberta: ", e);
            return null;
        }
    }
}
