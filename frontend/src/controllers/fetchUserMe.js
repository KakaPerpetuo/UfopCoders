import api from './api';

export class FetchUserMe {
    async execute() {
        try {
            const response = await api.get(`/api/users/me/`);

            return response;
        } catch (e) {
            console.error(e);
            console.log("Erro ao buscar usuario logado: ", e);
        }
    }
}