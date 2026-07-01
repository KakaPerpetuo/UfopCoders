import axios from 'axios';

export class GetUserProjects {
    async execute(search, tags) {
        
        const token = localStorage.getItem("token");
        if(!token) {
            console.error("Usuario nao autenticado para get projects.");
            return null;
        }
        const params = {};
        if(search) {
            params.search = search;
        }
        if(tags) {
            params.tags = tags;
        }
        try {
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/GetProjects/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: params
            });

            return response;
        }
        catch(e) {
            console.error("Erro ao tentar metodo get projects: ", e);
            return null;
        }

    }
}