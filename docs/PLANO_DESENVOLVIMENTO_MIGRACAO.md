# Plano de desenvolvimento e migração

**Referência:** plano versão 2.0, fornecido em 13/10/2026, consolidado para acompanhamento no repositório.

O [documento original](../PLANO_MIGRACAO_SISTEMA_BIBLIOTECA.md) permanece preservado na raiz.

O objetivo é substituir definitivamente a planilha operacional, preservando os registros históricos após autorização, validação técnica e transição controlada. O desenvolvimento ocorre no Codex Web e no GitHub; a estação institucional acessará a aplicação pelo navegador.

Não enviar a planilha original nem extratos com documentos, contatos, endereço, nascimento ou histórico individual a ferramentas não autorizadas. A migração real depende de autorização institucional e de hospedagem/processamento aprovados pela TI e compatíveis com a LGPD.

## Requisitos para substituir a planilha

- Contas individuais e permissões de operador, gestor e administrador técnico, a validar.
- Cadastro e consulta de leitores com minimização e restrição dos dados pessoais.
- Obras separadas de exemplares físicos identificados; disponibilidade vinculada à circulação.
- Empréstimos com múltiplos itens, datas e regras configuráveis.
- Devolução total ou parcial, com responsável, data e atualização por item.
- Renovação com preservação dos vencimentos antigos.
- Reservas com política institucional definida.
- Dashboard e relatórios conciliáveis, histórico e auditoria.
- Exportação autorizada, backups, restauração testada e correção rastreável de erros.
- Navegador responsivo e acessível sob a política de rede institucional.

## Modelo lógico proposto

O modelo inclui usuários, leitores, obras, exemplares, empréstimos, itens, renovações, reservas, eventos de circulação, auditoria e importação do legado. Preservar IDs antigos como referência, e não como chave automaticamente única.

Na fase de backend, priorizar integridade transacional: impedir empréstimos ativos simultâneos do mesmo exemplar; preservar registros com histórico; validar renovações; guardar vencimentos anteriores; controlar permissões no servidor; aceitar importações incompletas somente como pendências explícitas, sem inventar valores.

## Fases

| Fase                   | Resultado e condição de avanço                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Preparação         | Responsável institucional e TI identificados; políticas e ambiente aprovados; protótipo sem dados reais                                                 |
| 1 — Protótipo          | Interface, navegação, consultas e futuros fluxos fictícios validados pela equipe                                                                        |
| 2 — Núcleo             | Backend, banco relacional, autenticação, perfis, transações, auditoria, testes e backup/restauração                                                     |
| 3 — Migração assistida | Cópia institucional preservada; exportação autorizada; IDs mapeados; duplicatas e ambiguidades revisadas; totais reconciliados; relatório de pendências |
| 4 — Operação paralela  | Sistema e controle temporário acompanhados em período aprovado; conciliação diária e correções                                                          |
| 5 — Produção           | Planilha final congelada; diferença final importada; corte, responsáveis, backups e reversão documentados                                               |
| 6 — Suporte            | Monitoramento, backups, atualizações e evolução conforme a operação real                                                                                |

## Aceite operacional futuro

- Cadastrar e buscar leitores respeitando permissões.
- Registrar múltiplos itens e impedir circulação duplicada de exemplar indisponível.
- Aplicar prazos validados e configurados, inclusive na renovação.
- Devolver um item mantendo os demais emprestados.
- Preservar eventos com data e operador após a devolução.
- Converter reserva em empréstimo apenas na retirada efetiva.
- Conciliar dashboard, relatórios e transações; atualizar atrasos pela data.
- Restringir acesso a dados pessoais e operações.
- Gerar backups e testar restauração.
- Reconciliar dados por aba e documentar pendências sem descartes silenciosos.
- Funcionar na rede e no navegador do computador institucional.

## Decisões pendentes

1. A direção e a TI autorizam desenvolvimento, hospedagem e tratamento de dados pessoais?
2. Qual é a regra exata para prazos, renovação, limite de itens, reservas e eventual multa?
3. Como identificar e diferenciar fisicamente os exemplares?
4. Quantos funcionários usarão o sistema, de quais locais e com quais necessidades de conectividade?
5. Qual é o prazo de guarda de históricos e registros pessoais, e quem aprovará a retenção?

Esta primeira entrega não inicia a migração. O próximo incremento deve ser aprovado a partir da revisão do protótipo e das regras que afetarem o fluxo escolhido.
