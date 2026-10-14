# Biblioteca Pública Municipal de Cianorte

Primeira entrega do sistema web que apoiará a substituição da planilha de gestão da biblioteca: uma interface React + TypeScript, responsiva, com dashboard e consultas demonstrativas.

**Todos os registros são fictícios.** A aplicação usa somente dados em memória, com data de referência fixa em **13/10/2026**. Não há banco de dados, autenticação, importação da planilha ou gravação de operações nesta entrega.

## O que pode ser revisado no navegador

- Menu com Dashboard, Empréstimos, Devoluções, Renovações, Reservas, Livros, Leitores, Histórico e Relatórios.
- Indicadores calculados a partir do cenário fictício; obras e exemplares contados separadamente.
- Gráfico com seleção de período, panorama do acervo, atalhos e alertas de exemplo.
- Consultas com busca, filtros, paginação e detalhes dos registros fictícios.
- Busca global de livros e leitores; exportação de um resumo agregado fictício.
- Layout em azul, branco e cinza, menu móvel, navegação por teclado e tabelas com rolagem própria em telas estreitas.

## Desenvolvimento no ambiente Codex

Requer Node.js 22.12+ (CI usa Node.js 24) e npm. Os comandos abaixo são executados no ambiente de desenvolvimento; o computador institucional só precisará acessar o endereço web aprovado quando houver hospedagem.

```bash
npm ci
npm run dev
```

Abra a prévia web na porta 5173. Nenhum arquivo da planilha deve ser carregado no protótipo.

## Verificações

```bash
npm run format:check
npm run lint
npm run build
npx playwright install chromium
npm test
```

`npm run build` inclui a verificação TypeScript. `npm run check` reúne formatação, lint, build e testes. Os testes Playwright executam contra a compilação de produção em computador e celular e verificam navegação, filtros, busca, detalhes, exportação, largura responsiva e acessibilidade automática com axe.

Se o ambiente já disponibilizar Chromium, é possível selecionar esse executável:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test -- --workers=2
```

Para conferir a compilação de produção manualmente:

```bash
npm run build
npm run preview
```

## Organização

```text
src/
  components/   Dashboard, consultas e elementos reutilizáveis
  data/demo.ts  Cenário fictício tipado e cálculos demonstrativos
  App.tsx       Estrutura, menu, busca global e navegação
  navigation.ts Definição central do menu e rotas por fragmento
  styles.css    Layout, identidade visual e responsividade
tests/          Verificações de interface em navegador
docs/           Especificação, arquitetura e roteiro de revisão
.github/        Verificações automáticas e modelo de Pull Request
```

As fontes e a ilustração são servidas pela própria aplicação; a interface não depende de APIs, fontes remotas ou serviços externos. `package-lock.json` fixa as versões instaladas.

## Documentação e próximas etapas

- [Especificação do sistema](docs/ESPECIFICACAO_SISTEMA_BIBLIOTECA.md)
- [Plano de desenvolvimento e migração](docs/PLANO_DESENVOLVIMENTO_MIGRACAO.md)
- [Arquitetura e escopo desta entrega](docs/ARQUITETURA.md)
- [Roteiro e descrição da revisão](docs/REVISAO_PR.md)

As próximas entregas dependem da validação das regras da biblioteca. Prazo, limite de exemplares, multas, renovações, reservas e disponibilidade física não são políticas definidas por este protótipo. Dados reais, autenticação e migração permanecem fora desta primeira tarefa.
