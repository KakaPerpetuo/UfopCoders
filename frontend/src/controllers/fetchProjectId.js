import axios from "axios";

//     path('api/projects/<int:id>/join/', ProjectJoinView.as_view(), name='project-join'),


export class fetchProjectId {
    
  async execute(token, projetoId){
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects/${projetoId}/`,
             { headers: { Authorization: `Bearer ${token}` } }
        )
        return response.data
    } catch (e){
        console.error("Erro ao listar detalhe do projeto", e)
        throw e;
    }
  }
}