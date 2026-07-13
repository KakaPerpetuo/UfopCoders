import api from './api';

export class FetchUserAuthentication {
    async execute(email, pass) {
        const userData = {
            email: email,
            password: pass
        };

        try {
            const response = await api.post(`/api/PostLogin/`, userData);

            return response;
        } catch(e) {
            console.error(e);
            console.log("Erro no login do usuário: ", e);
        }
    }
};