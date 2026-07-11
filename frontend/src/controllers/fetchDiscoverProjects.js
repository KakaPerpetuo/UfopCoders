import axios from 'axios';

export class FetchDiscoverProjects {
    async execute(token, search, tags) {
        const params = {};
        if (search) {
            params.search = search;
        }
        if (tags) {
            params.tags = tags;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: params
            });
            return response;
        } catch (e) {
            console.error("Erro ao buscar projetos para descoberta: ", e);
            return null;
        }
    }
}
