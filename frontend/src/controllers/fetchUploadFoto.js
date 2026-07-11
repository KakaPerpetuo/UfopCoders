import axios from 'axios';

export class FetchUploadFoto {
    async execute(token, arquivo) {
        const formData = new FormData();
        formData.append('foto', arquivo);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/upload-foto/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response;
        } catch (e) {
            console.error("Erro ao fazer upload da foto: ", e);
        }
    }
}