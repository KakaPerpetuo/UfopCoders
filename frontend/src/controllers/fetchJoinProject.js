import api from "./api";

export class JoinProject {
  async execute(projetoId){
      try {
        const response = await api.post(`/api/projects/${projetoId}/join/`,
             {}, // body vazio, backend pega o user direto do token
        )
        return response.data 
    } catch (e){
        console.error("Erro ao se candidatar", e)
        throw e
    }
  }
} 
