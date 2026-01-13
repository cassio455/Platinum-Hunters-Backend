import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { guideSchema } from "../../models/schemas/guide.js";
import { z } from "zod";

export function registerGuidePaths(registry: OpenAPIRegistry): void {
  // POST /guides
  registry.registerPath({
    method: "post",
    path: "/guides",
    summary: "Criar um novo guia",
    tags: ["Guides"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: guideSchema,
            example: {
              title: "Guia de Platina — God of War",
              game: "God of War",
              roadmap: "Conclua todas as missões principais, derrote as Valquírias...",
              trophies: [
                {
                  id: "123e4567-e89b-12d3-a456-426614174000",
                  name: "Platina",
                  type: "Platina",
                  description: "Conquiste todos os troféus do jogo",
                  rarity: "Raríssimo",
                  howTo: "Marque todos os outros troféus como conquistados para desbloquear a platina."
                }
              ],
              comments: []
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: "Guia criado com sucesso",
        content: {
          "application/json": {
            schema: guideSchema
          }
        }
      },
      400: { description: "Erro de validação" },
      500: { description: "Erro interno do servidor" }
    }
  });
// GET /guides
  registry.registerPath({
    method: "get",
    path: "/guides",
    summary: "Listar todos os guias",
    tags: ["Guides"],
    responses: {
      200: {
        description: "Lista de guias",
        content: {
          "application/json": {
            schema: z.array(guideSchema),
            example: [
              {
                title: "Guia de Platina — God of War",
                game: "God of War",
                roadmap: "Conclua todas as missões principais, derrote as Valquírias...",
                trophies: [
                  {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    name: "Platina",
                    type: "Platina",
                    description: "Conquiste todos os troféus do jogo",
                    rarity: "Raríssimo",
                    howTo: "Marque todos os outros troféus como conquistados para desbloquear a platina."
                  }
                ],
                comments: []
              }
            ]
          }
        }
      },
      500: { description: "Erro interno do servidor" }
    }
  });
  // PATCH /guides/{id}
registry.registerPath({
  method: "patch",
  path: "/guides/{id}",
  summary: "Editar um guia",
  tags: ["Guides"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: guideSchema
        }
      }
    }
  },
  responses: {
    200: { description: "Guia atualizado" },
    403: { description: "Sem permissão" },
    404: { description: "Guia não encontrado" },
    500: { description: "Erro interno do servidor" }
  }
});

// DELETE /guides/{id}
registry.registerPath({
  method: "delete",
  path: "/guides/{id}",
  summary: "Deletar um guia",
  tags: ["Guides"],
  responses: {
    200: { description: "Guia deletado com sucesso" },
    403: { description: "Sem permissão" },
    404: { description: "Guia não encontrado" },
    500: { description: "Erro interno do servidor" }
  }
});

// POST /guides/{id}/like
registry.registerPath({
  method: "post",
  path: "/guides/{id}/like",
  summary: "Curtir/descurtir um guia",
  tags: ["Guides"],
  responses: {
    200: { description: "Like registrado" },
    404: { description: "Guia não encontrado" },
    500: { description: "Erro interno do servidor" }
  }
});

// POST /guides/{id}/comments
registry.registerPath({
  method: "post",
  path: "/guides/{id}/comments",
  summary: "Adicionar comentário a um guia",
  tags: ["Guides"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ texto: z.string() })
        }
      }
    }
  },
  responses: {
    201: { description: "Comentário adicionado" },
    404: { description: "Guia não encontrado" },
    500: { description: "Erro interno do servidor" }
  }
});

// POST /guides/{id}/comments/{commentId}/reply
registry.registerPath({
  method: "post",
  path: "/guides/{id}/comments/{commentId}/reply",
  summary: "Responder a um comentário de um guia",
  tags: ["Guides"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ texto: z.string() })
        }
      }
    }
  },
  responses: {
    201: { description: "Resposta adicionada" },
    404: { description: "Guia ou comentário não encontrado" },
    500: { description: "Erro interno do servidor" }
  }
});
}