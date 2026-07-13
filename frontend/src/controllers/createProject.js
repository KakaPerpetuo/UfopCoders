import api from './api';

export class CreateProjectController {

    async execute(data) {

        try {
            const response = await api.post(`/api/projetos/`, data);

            return response;
        }
        catch(e) {
            console.error("Erro na validação:", e);
            throw e;
        }
    }
}