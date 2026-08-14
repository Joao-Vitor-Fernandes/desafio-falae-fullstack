# Falaê! Feedbacks

Aplicação full stack para acompanhamento de feedbacks recebidos por um restaurante (Google, iFood e pesquisas internas), desenvolvida como desafio técnico do processo seletivo de estágio da Falaê!.

Permite listar, buscar e filtrar feedbacks, acompanhar indicadores agregados, visualizar detalhes de um feedback, registrar anotações internas e alterar o status de atendimento, respeitando a regra de que um feedback crítico (nota 1 ou 2) só pode ser concluído após receber pelo menos uma anotação.

## Tecnologias

Backend: 
Node.js, TypeScript, Express, Prisma ORM, SQLite (via `@prisma/adapter-libsql`).

Frontend: 
React, TypeScript, Vite, Tailwind CSS v4.

> Nota: o projeto foi desenvolvido em agosto de 2026, e algumas dependências instaladas (Express 5, Prisma 7, TypeScript ~7, Tailwind v4, React 19) são versões recentes com mudanças relevantes em relação a tutoriais mais antigos — isso está detalhado em [AI_USAGE.md](./AI_USAGE.md).

## Requisitos para executar
- Node.js 18 ou superior
- npm

Não é necessário instalar nenhum banco de dados separadamente, pois o projeto usa SQLite (um arquivo local), criado automaticamente pelo Prisma.

## Instalação

``` bash
git clone <url-do-repositorio>
cd falae-feedback
``` 

# Backend
``` bash
cd backend
npm install
``` 

# Frontend
``` bash
cd ../frontend
npm install
``` 

## Configuração das variáveis de ambiente

Cada pasta (\`backend/\` e \`frontend/\`) tem um arquivo \`.env.example\`. Copie para \`.env\` em cada uma:

``` bash
# dentro de backend/
cp .env.example .env
```

``` bash
# dentro de frontend/
cp .env.example .env
``` 

**`backend/.env`**
``` bash
DATABASE_URL="file:./dev.db"
PORT=3333
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
``` bash
VITE_API_URL=http://localhost:3333/api
```

Os valores padrão já funcionam para rodar localmente sem nenhum ajuste.

## Configuração do banco de dados

O banco é SQLite (um único arquivo, sem necessidade de servidor). Dentro de \`backend/\`, rode:

``` bash
npx prisma migrate dev --name init
npx prisma db seed
```

O primeiro comando cria as tabelas (\`backend/prisma/dev.db\`); o segundo popula com 12 feedbacks e 3 anotações de teste, cobrindo os três canais, os três status e cenários de feedback crítico com e sem anotação, necessários para testar a regra de negócio.

Para inspecionar o banco visualmente: \`npx prisma studio\`.

## Como executar

Em dois terminais separados:

## Terminal 1 — backend
``` bash
cd backend
npm run dev
# roda em http://localhost:3333
``` 

## Terminal 2 — frontend
``` bash
cd frontend
npm run dev
# roda em http://localhost:5173
``` 

Acesse `http://localhost:5173` no navegador.

## Funcionalidades implementadas

- [x] Listagem de feedbacks (mais recentes primeiro), com estados de carregamento, vazio e erro
- [x] Busca por nome do cliente e por comentário
- [x] Filtros por canal, status e nota, combináveis entre si
- [x] Botão de limpar filtros
- [x] Indicadores (total, nota média, positivos, críticos) recalculados conforme os filtros ativos
- [x] Detalhes do feedback (modal)
- [x] Registro de anotações internas, com validação de descrição vazia/só espaços, e atualização da interface sem reload
- [x] Alteração de status (NOVO / EM_ANALISE / CONCLUIDO)
- [x] Regra de negócio do feedback crítico, validada no backend (HTTP 422 com mensagem explicativa) e refletida na interface
- [x] Testes manuais de todos os endpoints e fluxos (ver AI_USAGE.md)

## Decisões técnicas relevantes

- **Indicadores na mesma resposta da listagem** (\`GET /api/feedbacks\` retorna \`{ data, indicators }\`) em vez de uma rota separada — garante que os indicadores nunca fiquem fora de sincronia com os filtros aplicados.
- **\`channel\` e \`status\` são \`String\` no schema do Prisma, não \`enum\`** — o provider SQLite não suporta enum nativo. Os valores válidos são controlados via array \`as const\` em TypeScript.
- **SQLite em vez de PostgreSQL/MySQL** — elimina a necessidade de instalar e configurar um servidor de banco separado.
- **Tailwind CSS puro, sem biblioteca de componentes** — suficiente para o escopo pedido.
- **Detalhes do feedback em modal, não em página separada** — evita precisar de uma lib de rotas só pra uma tela.
- **Status HTTP 422 (não 400)** quando a regra do feedback crítico bloqueia a conclusão — a requisição é válida, o que impede é o estado atual do dado.
- **Prisma Client com driver adapter (\`@prisma/adapter-libsql\`)** — exigência da versão 7 do Prisma.

## Limitações conhecidas

- A busca não trata diferenças de acentuação (buscar "pessimo" não encontra "péssimo") — comportamento padrão do \`LIKE\` do SQLite.
- Não há paginação na listagem
- Testes automatizados não foram implementados (diferencial opcional no enunciado) — validação feita manualmente, detalhada em AI_USAGE.md.
- Interface fixa em tema claro, sem troca para tema escuro.
