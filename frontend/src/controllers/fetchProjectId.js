import api from "./api";

//     path('api/projects/<int:id>/join/', ProjectJoinView.as_view(), name='project-join'),


export class fetchProjectId {
    
  async execute(projetoId){
      try {
        const response = await api.get(`/api/projects/${projetoId}/`
        )
        return response.data
    } catch (e){
        console.error("Erro ao listar detalhe do projeto", e)
        throw e;
    }
  }
}