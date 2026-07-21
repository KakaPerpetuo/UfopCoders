import api from './api';

export class FetchRegisterUser {
    async execute(name, email, password, bio, cargo) {
        const userData = {
            nome: name,
            email: email,
            password: password,
            bio: bio || '',
            cargo: cargo || '',
        };
        try {
            const response = await api.post(`/api/CreateUser/`, userData);
            return response;
        } catch (e) {
            console.error(e);
            console.log("Erro no registro do usuário: ", e);
        }
    }
}