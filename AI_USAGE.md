# Uso de Inteligência Artificial

## Ferramentas utilizadas

Claude (Anthropic), utilizado via conversa em chat, do planejamento inicial até a documentação final.

## Como a IA foi utilizada

- Planejamento da arquitetura antes de escrever qualquer código (backend com o uso de Node.js): escolha de stack, estrutura de pastas e organização das responsabilidades entre rotas/controllers.
- Geração de uma primeira versão do código em certas camadas, sempre explicada parte por parte para verificar e ajeitar a implementação.
- Investigação de erros reais que apareceram durante o desenvolvimento (detalhados abaixo).
- Organização desta documentação.

Todo o código gerado foi revisado, testado manualmente por mim e explicado antes de eu aceitar e seguir para a próxima etapa, onde o processo foi conduzido em partes pequenas e sequenciais, não em um bloco único gerado de uma vez.

## Exemplos de interações

1. *"Ajude a planejar a arquitetura do projeto antes de escrever código, considerando que já tenho experiência com PHP/Laravel e React/Next.js, mas pouca com Node.js no backend."*
2. *"O \`npx prisma migrate dev\` deu esse erro: [erro P1012 sobre \`datasource.url\`]. Me diga mais sobre erro P1012"*
3. *"Ao rodar o seed, deu \`TypeError: PrismaLibSQL is not a constructor\`. Me dê conselhos sobre como resolver?"*

## Sugestão incorreta ou incompleta

A IA inicialmente orientou a configurar o Prisma do jeito "tradicional" (URL do banco direto no \`schema.prisma\`, \`new PrismaClient()\` sem argumentos). Ao rodar \`npx prisma migrate dev\`, isso gerou erro de validação (P1012), porque a versão 7 do Prisma mudou essa arquitetura: a URL precisa ir para um novo arquivo \`prisma.config.ts\`, e o \`PrismaClient\` passou a exigir um driver adapter.

O que precisou ser corrigido: criação do \`prisma.config.ts\`, remoção da \`url\` do schema, instalação de driver adapter (tentei \`@prisma/adapter-better-sqlite3\` primeiro, precisei trocar pra \`@prisma/adapter-libsql\` porque o primeiro exigia compilação nativa que minha máquina não tinha configurada). Nesse processo, a IA também sugeriu inicialmente o nome errado de uma importação (\`PrismaLibSQL\` em vez de \`PrismaLibSql\`), só corrigido depois de pesquisar a documentação oficial.

## Validação

- Testes manuais em todos os endpoints via Thunder Client, incluindo casos de erro (id inválido, anotação vazia, status inválido, bloqueio da regra crítica com 422).
- Inspeção direta do banco via \`npx prisma studio\`.
- Build de produção sem erros (\`npm run build\`, backend e frontend).
- Testes manuais na interface: buscar/filtrar, abrir detalhes, adicionar anotação, testar o bloqueio/liberação da regra do feedback crítico.

## Decisões técnicas

**ORM (Prisma vs. TypeORM):** TypeORM usa decorators, parecido com o Doctrine do Symfony que eu já conhecia; Prisma tem setup mais rápido e é mais comum hoje. Optei por Prisma pela produtividade.

**Indicadores (rota separada vs. junto com a listagem):** decidi embutir na mesma resposta de \`GET /api/feedbacks\` pra evitar duas requisições a cada filtro e garantir que os indicadores nunca fiquem dessincronizados da lista exibida.

## Domínio da solução

Bom Domínio: estrutura do backend (rotas → controllers → banco), lógica de filtros, a regra de negócio do feedback crítico, e organização dos componentes React.

Preciso estudar melhor: o uso do Prisma e de suaa configuração mais recente (driver adapters, \`prisma.config.ts\`), mudança muito recente, ainda não tenho a mesma fluência que tenho com Symfony. Também é a primeira vez usando Node.js "puro" com mais profundidade.