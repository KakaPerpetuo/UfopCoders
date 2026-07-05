import axios from 'axios';

export class FetchUserProjects {
    async execute(token) {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/GetProjects/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (e) {
            console.error(e);
            console.log("Erro ao buscar projetos: ", e);
        }
    }
}