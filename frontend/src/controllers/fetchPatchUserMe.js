import api from './api';

// atualiza dados do usuário logado
export class FetchPatchUserMe {
    async execute(data) {
        try {
            const response = await api.patch(`/api/users/me/`, data, {
            });
            return response;
        } catch (error) {
            console.error("Erro ao atualizar usuário: ", error);
        }
    }
}