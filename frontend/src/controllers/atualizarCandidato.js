import api from './api'; 

export class AtualizarCandidato {
    
    async execute(projetoId, membershipId, status) {
        try {
            
            
            const response = await api.patch(
                `/api/projects/${projetoId}/candidatos/${membershipId}/`,
                { status }
            );
            
            return response;
        } catch (e) {
            console.error("Erro ao atualizar candidato: ", e);
            
            
            throw e; 
        }
    }
}