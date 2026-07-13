import api from './api';

export class FetchUserProjects {
    async execute() {
        try {
            const response = await api.get(`/api/GetProjects/`);
            return response;
        } catch (e) {
            console.error(e);
            console.log("Erro ao buscar projetos: ", e);
        }
    }
}