import axios from "axios";

export class JoinProject {
  async execute(token, projetoId){
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/projects/${projetoId}/join/`,
             {}, // body vazio, backend pega o user direto do token
             { headers: { Authorization: `Bearer ${token}` } }
        )
        return response.data 
    } catch (e){
        console.error("Erro ao se candidatar", e)
        throw e
    }
  }
} 
