# feat: cria interface inicial da Biblioteca Municipal de Cianorte

A biblioteca precisa de uma interface web para iniciar a substituição da planilha de gestão. Esta entrega cria o projeto React + TypeScript e um dashboard responsivo em azul, branco e cinza, com indicadores demonstrativos e navegação pelos nove módulos solicitados.

As consultas usam um cenário fictício em memória, com busca, filtros, paginação, detalhes e um resumo agregado exportável. Indicadores e gráficos usam esses mesmos registros. O catálogo distingue obras de exemplares. A especificação e o plano originais na raiz foram preservados; a documentação em `docs/` explica a arquitetura e o escopo atual.

## Escopo

- React, TypeScript, Vite, ícones e fontes locais.
- Dashboard, Empréstimos, Devoluções, Renovações, Reservas, Livros, Leitores, Histórico e Relatórios.
- Layout para computador e celular, menu móvel, diálogos nativos, atalhos por teclado e tabelas com rolagem própria.
- Dados exclusivamente fictícios, com referência fixa em 13/10/2026.
- Sem banco, autenticação, operações de gravação ou importação da planilha nesta etapa.
- Sem definição de políticas de multa, prazo, renovação ou reserva.
- CI de formatação, lint, compilação TypeScript/Vite e testes Playwright.

## Validação

No ambiente Codex, formatação, lint e compilação de produção passaram. Os **24 testes Playwright** passaram em computador e celular, incluindo verificação automática de acessibilidade com axe nos nove módulos. Menu móvel, ajuda, detalhes, notificações e perfil também foram verificados com axe. `npm audit` não encontrou vulnerabilidades nas dependências instaladas.

```bash
npm run format:check
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test -- --workers=2
npm audit
```

A análise automatizada de acessibilidade cobre as telas verificadas e não substitui a revisão com usuários. O workflow repete as verificações; seu resultado no GitHub deve ser conferido antes da integração.

## Roteiro de revisão no navegador

1. Abrir o dashboard e conferir os indicadores: 1.248 exemplares, 286 leitores, 48 empréstimos em aberto e 7 em atraso, todos fictícios.
2. Alterar o gráfico para os últimos três meses e expandir os valores em tabela.
3. Clicar no indicador de atrasos e verificar a lista filtrada de sete registros; abrir os detalhes de um deles.
4. Buscar “mapa” no cabeçalho e abrir a obra “O mapa das estrelas”; conferir a separação entre obra e exemplares.
5. Abrir Leitores, navegar à próxima página e buscar um identificador, como `LE-001`.
6. Percorrer os nove itens do menu e conferir os retornos e prazos anteriores nas respectivas consultas.
7. Em Relatórios, exportar o resumo; o arquivo contém somente totais fictícios, sem registros individuais de leitores.
8. Repetir a navegação em uma tela de celular e conferir menu, foco, fechamento por Escape e rolagem das tabelas.

## Próxima entrega

Validar a interface e escolher um fluxo de circulação para prototipar. Regras operacionais, autenticação, banco relacional, auditoria persistente, backups e migração real continuam sujeitos às decisões descritas na documentação.

## Prévias

- [Dashboard em computador](imagens/dashboard-desktop.png)
- [Dashboard em celular](imagens/dashboard-mobile.png)
