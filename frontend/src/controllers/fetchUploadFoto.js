import api from './api';

export class FetchUploadFoto {
    async execute(arquivo) {
        const formData = new FormData();
        formData.append('foto', arquivo);
        try {
            const response = await api.post(
                `/api/users/upload-foto/`,
                formData
            );
            return response;
        } catch (e) {
            console.error("Erro ao fazer upload da foto: ", e);
        }
    }
}