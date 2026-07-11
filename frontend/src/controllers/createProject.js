import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';


export class CreateProjectController {

    async execute(token, data) {

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/projetos/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response;
        }
        catch(e) {
            console.error("Erro na validação:", error.response?.data);
        }
    }
}