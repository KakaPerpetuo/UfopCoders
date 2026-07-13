import api from './api';

export class GetUserProjects {
    async execute(search, tags) {

        const params = {};
        if (search) {
            params.search = search;
        }
        if (tags && (Array.isArray(tags) ? tags.length > 0 : true)) {
            params.tags = Array.isArray(tags) ? tags.join(',') : tags;
        }
        try {

            const response = await api.get(`/api/GetProjects/`, {
                params: params
            });

            return response;
        }
        catch (e) {
            console.error("Erro ao tentar metodo get projects: ", e);
            return null;
        }

    }
}