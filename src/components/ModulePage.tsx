import { useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  Search,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { navigation } from '../navigation'
import type { Page } from '../navigation'
import {
  availableCopies,
  copies,
  findCopy,
  findReader,
  findWork,
  formatDate,
  formatNumber,
  initials,
  loanStatus,
  loans,
  monthlyMovement,
  normalize,
  readers,
  renewals,
  reservations,
  stats,
  workForLoan,
  works,
} from '../data/demo'
import { BookCover, DataTable, Pagination, Status } from './ui'
import { MovementChart } from './Dashboard'

type Details = { title: string; fields: [string, string][] }
type RecordRow = {
  id: string
  search: string
  cells: ReactNode[]
  details: Details
}

const descriptions: Record<Exclude<Page, 'dashboard'>, string> = {
  emprestimos:
    'Consulte as retiradas, os vencimentos e as situações dos empréstimos.',
  devolucoes: 'Acompanhe os exemplares que já retornaram à biblioteca.',
  renovacoes: 'Consulte as alterações de prazo e os vencimentos anteriores.',
  reservas: 'Conheça a visualização de reservas do cenário demonstrativo.',
  livros: 'Cada livro, uma possibilidade. Explore o nosso acervo de exemplo.',
  leitores: 'Uma comunidade que cresce a cada nova história.',
  historico: 'Conheça a linha do tempo das movimentações de exemplo.',
  relatorios: 'Transforme movimentações em uma visão mais clara da biblioteca.',
}

function recordsFor(page: Page): { headers: string[]; rows: RecordRow[] } {
  if (page === 'leitores')
    return {
      headers: ['Leitor', 'Identificador', 'Cadastro', ''],
      rows: readers.map((reader) => ({
        id: reader.id,
        search: `${reader.id} ${reader.name}`,
        cells: [
          <div className="person-cell">
            <span className="avatar">{initials(reader.name)}</span>
            <strong>{reader.name}</strong>
          </div>,
          <span className="record-code">{reader.id}</span>,
          formatDate(reader.joinedAt),
        ],
        details: {
          title: reader.name,
          fields: [
            ['Identificador fictício', reader.id],
            ['Data do cadastro', formatDate(reader.joinedAt)],
            ['Dados pessoais', 'Somente nome fictício neste protótipo.'],
          ],
        },
      })),
    }

  if (page === 'renovacoes')
    return {
      headers: [
        'Renovação',
        'Leitor / empréstimo',
        'Renovada em',
        'Prazo anterior',
        'Novo prazo',
        '',
      ],
      rows: renewals.map((renewal) => {
        const loan = loans.find((entry) => entry.id === renewal.loanId)!
        const reader = findReader(loan.readerId)
        return {
          id: renewal.id,
          search: `${renewal.id} ${renewal.loanId} ${reader.name}`,
          cells: [
            <span className="record-code">{renewal.id}</span>,
            <div className="stacked-cell">
              <strong>{reader.name}</strong>
              <small>{renewal.loanId}</small>
            </div>,
            formatDate(renewal.occurredAt),
            formatDate(renewal.previousDueAt),
            <strong>{formatDate(renewal.newDueAt)}</strong>,
          ],
          details: {
            title: `Renovação ${renewal.id}`,
            fields: [
              ['Empréstimo', renewal.loanId],
              ['Leitor fictício', reader.name],
              ['Prazo anterior', formatDate(renewal.previousDueAt)],
              ['Novo vencimento', formatDate(renewal.newDueAt)],
              [
                'Observação',
                'Datas de exemplo; regras de renovação ainda serão validadas.',
              ],
            ],
          },
        }
      }),
    }

  if (page === 'reservas')
    return {
      headers: ['Reserva', 'Leitor', 'Livro', 'Solicitada em', 'Situação', ''],
      rows: reservations.map((reservation) => {
        const reader = findReader(reservation.readerId)
        const work = findWork(reservation.workId)
        return {
          id: reservation.id,
          search: `${reservation.id} ${reader.name} ${work.title} ${reservation.state}`,
          cells: [
            <span className="record-code">{reservation.id}</span>,
            reader.name,
            work.title,
            formatDate(reservation.requestedAt),
            <Status>{reservation.state}</Status>,
          ],
          details: {
            title: `Reserva ${reservation.id}`,
            fields: [
              ['Leitor fictício', reader.name],
              ['Obra', work.title],
              ['Solicitada em', formatDate(reservation.requestedAt)],
              ['Situação ilustrativa', reservation.state],
              [
                'Regras de reserva',
                'Fila, validade e prioridade dependem de validação da biblioteca.',
              ],
            ],
          },
        }
      }),
    }

  if (page === 'historico') {
    const events = loans.flatMap((loan) => {
      const reader = findReader(loan.readerId)
      const work = workForLoan(loan)
      return [
        {
          id: `${loan.id}-retirada`,
          date: loan.borrowedAt,
          type: 'Empréstimo',
          reference: loan.id,
          reader: reader.name,
          title: work.title,
        },
        ...loan.items
          .filter((item) => item.returnedAt)
          .map((item) => ({
            id: `${loan.id}-${item.copyId}-retorno`,
            date: item.returnedAt!,
            type: 'Devolução',
            reference: loan.id,
            reader: reader.name,
            title: findWork(findCopy(item.copyId).workId).title,
          })),
      ]
    })
    events.push(
      ...renewals.map((renewal) => {
        const loan = loans.find((entry) => entry.id === renewal.loanId)!
        return {
          id: renewal.id,
          date: renewal.occurredAt,
          type: 'Renovação',
          reference: loan.id,
          reader: findReader(loan.readerId).name,
          title: workForLoan(loan).title,
        }
      }),
    )
    return {
      headers: ['Movimentação', 'Data', 'Leitor', 'Livro', 'Referência', ''],
      rows: events
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((event) => ({
          id: event.id,
          search: `${event.id} ${event.reference} ${event.reader} ${event.title} ${event.type}`,
          cells: [
            <span className="event-type">{event.type}</span>,
            formatDate(event.date),
            event.reader,
            event.title,
            <span className="record-code">{event.reference}</span>,
          ],
          details: {
            title: event.type,
            fields: [
              ['Referência', event.reference],
              ['Data', formatDate(event.date)],
              ['Leitor fictício', event.reader],
              ['Obra', event.title],
              ['Operador de exemplo', 'Equipe demonstrativa'],
            ],
          },
        })),
    }
  }

  const entries =
    page === 'devolucoes'
      ? loans.filter((loan) => loanStatus(loan) === 'Devolvido')
      : loans
  return {
    headers: [
      'Código',
      'Leitor',
      'Livro',
      page === 'devolucoes' ? 'Devolução' : 'Vencimento',
      'Situação',
      '',
    ],
    rows: entries.map((loan) => {
      const reader = findReader(loan.readerId)
      const work = workForLoan(loan)
      return {
        id: loan.id,
        search: `${loan.id} ${reader.name} ${reader.id} ${work.title} ${loanStatus(loan)}`,
        cells: [
          <span className="record-code">{loan.id}</span>,
          <div className="person-cell">
            <span className="avatar">{initials(reader.name)}</span>
            <span>
              <strong>{reader.name}</strong>
              <small>{reader.id}</small>
            </span>
          </div>,
          <div className="book-cell">
            <BookCover title={work.title} color={work.color} small />
            <span>{work.title}</span>
          </div>,
          formatDate(
            page === 'devolucoes' ? loan.items[0].returnedAt! : loan.dueAt,
          ),
          <Status>{loanStatus(loan)}</Status>,
        ],
        details: {
          title: `Empréstimo ${loan.id}`,
          fields: [
            ['Leitor fictício', reader.name],
            ['Obra', work.title],
            ['Exemplar', loan.items[0].copyId],
            ['Retirada', formatDate(loan.borrowedAt)],
            ['Vencimento', formatDate(loan.dueAt)],
            ['Situação', loanStatus(loan)],
            ...(loan.items[0].returnedAt
              ? [
                  ['Devolvido em', formatDate(loan.items[0].returnedAt)] as [
                    string,
                    string,
                  ],
                ]
              : []),
          ],
        },
      }
    }),
  }
}

function downloadReport() {
  const lines = [
    ['Relatório demonstrativo — Biblioteca Municipal de Cianorte'],
    ['Data de referência', '13/10/2026'],
    ['Somente dados fictícios'],
    [],
    ['Mês de 2026', 'Empréstimos', 'Devoluções'],
    ...monthlyMovement.map((month) => [
      month.label,
      String(month.loans),
      String(month.returns),
    ]),
    [],
    ['Exemplares cadastrados', String(stats.books)],
    ['Leitores cadastrados', String(stats.readers)],
    ['Empréstimos em aberto', String(stats.open)],
    ['Empréstimos em atraso', String(stats.overdue)],
  ]
  const file = new Blob(
    ['\uFEFF', lines.map((line) => line.join(';')).join('\r\n')],
    { type: 'text/csv;charset=utf-8;' },
  )
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = 'resumo-demonstrativo-biblioteca-2026-10-13.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function ModulePage({
  page,
  initialSearch,
}: {
  page: Exclude<Page, 'dashboard'>
  initialSearch: string
}) {
  const specialSearch =
    page === 'emprestimos' &&
    ['aberto', 'atraso', 'hoje'].includes(initialSearch)
  const [query, setQuery] = useState(specialSearch ? '' : initialSearch)
  const [filter, setFilter] = useState(specialSearch ? initialSearch : 'todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [details, setDetails] = useState<Details | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const title = navigation.find((item) => item.id === page)!.label
  const recordSet =
    page === 'livros' || page === 'relatorios'
      ? { headers: [], rows: [] }
      : recordsFor(page)
  const filteredRows = recordSet.rows
    .filter((record) => normalize(record.search).includes(normalize(query)))
    .filter((record) => {
      if (page !== 'emprestimos' || filter === 'todos') return true
      const loan = loans.find((entry) => entry.id === record.id)!
      return filter === 'aberto'
        ? loanStatus(loan) !== 'Devolvido'
        : filter === 'atraso'
          ? loanStatus(loan) === 'Em atraso'
          : filter === 'devolvido'
            ? loanStatus(loan) === 'Devolvido'
            : loan.dueAt === '2026-10-13' && loanStatus(loan) !== 'Devolvido'
    })
  const filteredWorks = works.filter((work) =>
    normalize(
      `${work.id} ${work.title} ${work.author} ${work.category}`,
    ).includes(normalize(query)),
  )
  const openDetails = (next: Details) => {
    setDetails(next)
    dialog.current?.showModal()
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="heading-eyebrow">
            {page === 'livros' || page === 'leitores'
              ? 'CADASTROS'
              : page === 'historico' || page === 'relatorios'
                ? 'ANÁLISE'
                : 'CIRCULAÇÃO'}
          </div>
          <h1>{title}</h1>
          <p>{descriptions[page]}</p>
        </div>
        <span className="demo-pill">
          <span />
          Dados fictícios
        </span>
      </div>
      {page === 'relatorios' ? (
        <>
          <div className="report-banner">
            <div>
              <span className="eyebrow">RESUMO DEMONSTRATIVO</span>
              <h2>Histórias que os números contam.</h2>
              <p>
                Dados consolidados do cenário fictício até 13 de outubro de
                2026.
              </p>
            </div>
            <button className="button button-primary" onClick={downloadReport}>
              <Download size={17} />
              Exportar resumo
            </button>
          </div>
          <div className="report-stats">
            {[
              ['Exemplares no acervo', stats.books],
              ['Leitores cadastrados', stats.readers],
              ['Empréstimos registrados', loans.length],
              ['Devoluções registradas', stats.returned],
            ].map(([label, value]) => (
              <div className="panel" key={label}>
                <span>{label}</span>
                <strong>{formatNumber(Number(value))}</strong>
              </div>
            ))}
          </div>
          <MovementChart />
          <section className="panel report-table">
            <div className="panel-heading">
              <div>
                <h2>Acervo por categoria</h2>
                <p>Obras e exemplares são contados separadamente.</p>
              </div>
            </div>
            <DataTable
              headers={[
                'Categoria',
                'Obras',
                'Exemplares',
                'Disponíveis no cenário',
              ]}
              label="Resumo fictício do acervo por categoria"
              rows={[...new Set(works.map((work) => work.category))].map(
                (category) => {
                  const ids = works
                    .filter((work) => work.category === category)
                    .map((work) => work.id)
                  return [
                    category,
                    ids.length,
                    copies.filter((copy) => ids.includes(copy.workId)).length,
                    availableCopies.filter((copy) => ids.includes(copy.workId))
                      .length,
                  ]
                },
              )}
            />
          </section>
        </>
      ) : (
        <section
          className={`panel module-panel ${page === 'livros' ? 'catalog-panel' : ''}`}
        >
          <div className="module-toolbar">
            <label className="module-search">
              <Search size={18} />
              <input
                type="search"
                aria-label={`Buscar em ${title}`}
                placeholder={
                  page === 'livros'
                    ? 'Buscar por título, autor ou categoria...'
                    : 'Buscar por nome, título ou código...'
                }
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setCurrentPage(1)
                }}
              />
            </label>
            {page === 'emprestimos' && (
              <select
                aria-label="Filtrar empréstimos por situação"
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="todos">Todas as situações</option>
                <option value="aberto">Em aberto (inclui atrasos)</option>
                <option value="atraso">Em atraso</option>
                <option value="hoje">Vencem hoje</option>
                <option value="devolvido">Devolvidos</option>
              </select>
            )}
            <span className="results-count" aria-live="polite">
              {page === 'livros' ? filteredWorks.length : filteredRows.length}{' '}
              {page === 'livros' ? 'obras' : 'registros'}
            </span>
          </div>
          {page === 'livros' ? (
            <>
              <div className="catalog-grid">
                {filteredWorks.map((work) => {
                  const workCopies = copies.filter(
                    (copy) => copy.workId === work.id,
                  )
                  const available = availableCopies.filter(
                    (copy) => copy.workId === work.id,
                  ).length
                  return (
                    <button
                      className="catalog-card"
                      key={work.id}
                      onClick={() =>
                        openDetails({
                          title: work.title,
                          fields: [
                            ['Identificador da obra', work.id],
                            ['Autor fictício', work.author],
                            ['Categoria', work.category],
                            ['Exemplares fictícios', String(workCopies.length)],
                            ['Disponíveis no cenário', String(available)],
                            [
                              'Exemplo de exemplar',
                              `${workCopies[0].id} · ${workCopies[0].shelf}`,
                            ],
                          ],
                        })
                      }
                    >
                      <BookCover title={work.title} color={work.color} />
                      <span className="catalog-category">{work.category}</span>
                      <h2>{work.title}</h2>
                      <p>{work.author}</p>
                      <span className="catalog-availability">
                        <span />
                        {available} disponíveis no cenário
                      </span>
                      <span className="catalog-card-footer">
                        {workCopies.length} exemplares
                        <ArrowRight size={15} />
                      </span>
                    </button>
                  )
                })}
              </div>
              {!filteredWorks.length && (
                <div className="empty-state">
                  <Search size={28} />
                  <strong>Nenhuma obra encontrada.</strong>
                  <span>Tente outro título, autor ou categoria.</span>
                </div>
              )}
              <div className="catalog-note">
                <BookOpen size={17} />
                {formatNumber(copies.length)} exemplares fictícios distribuídos
                em {works.length} obras de exemplo.
              </div>
            </>
          ) : (
            <>
              <DataTable
                headers={recordSet.headers}
                label={`Consulta demonstrativa de ${title}`}
                rows={filteredRows
                  .slice((currentPage - 1) * 10, currentPage * 10)
                  .map((record) => [
                    ...record.cells,
                    <button
                      className="icon-button detail-button"
                      aria-label={`Ver detalhes de ${record.id}`}
                      onClick={() => openDetails(record.details)}
                    >
                      <ChevronRight size={17} />
                    </button>,
                  ])}
              />
              <Pagination
                count={filteredRows.length}
                page={currentPage}
                onChange={setCurrentPage}
              />
            </>
          )}
          <div className="module-footnote">
            Consulta demonstrativa · cadastros e operações serão implementados
            nas próximas entregas.
          </div>
        </section>
      )}
      <dialog
        ref={dialog}
        className="details-dialog"
        aria-labelledby="detail-title"
      >
        <button
          className="icon-button dialog-close"
          aria-label="Fechar detalhes"
          onClick={() => dialog.current?.close()}
        >
          <X size={20} />
        </button>
        <span className="eyebrow">REGISTRO FICTÍCIO</span>
        <h2 id="detail-title">{details?.title}</h2>
        <dl>
          {details?.fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <button
          className="button button-primary"
          onClick={() => dialog.current?.close()}
        >
          Concluir
          <ChevronRight size={16} />
        </button>
      </dialog>
    </>
  )
}
