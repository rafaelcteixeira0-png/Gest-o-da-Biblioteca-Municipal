import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  LibraryBig,
  Repeat2,
  Sparkles,
  TriangleAlert,
  UsersRound,
} from 'lucide-react'
import type { Navigate } from '../navigation'
import {
  activeLoans,
  availableCopies,
  findReader,
  formatDate,
  formatNumber,
  initials,
  loanStatus,
  monthlyMovement,
  stats,
  workForLoan,
  works,
} from '../data/demo'
import { BookCover, DataTable, Status } from './ui'

export function MovementChart() {
  const [period, setPeriod] = useState(6)
  const data = monthlyMovement.slice(-period)
  const chartWidth = 600
  const left = 38
  const plotWidth = 550
  const chartHeight = 170
  const gap = plotWidth / data.length
  const valueY = (value: number) =>
    12 + chartHeight - (value / 100) * chartHeight

  return (
    <section className="panel movement-panel" aria-labelledby="movement-title">
      <div className="panel-heading">
        <div>
          <h2 id="movement-title">Movimentação da biblioteca</h2>
          <p>Empréstimos e devoluções ao longo do tempo</p>
        </div>
        <select
          aria-label="Período do gráfico"
          value={period}
          onChange={(event) => setPeriod(Number(event.target.value))}
        >
          <option value="6">Últimos 6 meses</option>
          <option value="3">Últimos 3 meses</option>
        </select>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-loans" />
          Empréstimos
        </span>
        <span>
          <i className="legend-returns" />
          Devoluções
        </span>
        <small>2026</small>
      </div>
      <figure className="movement-chart">
        <svg
          viewBox={`0 0 ${chartWidth} 215`}
          role="img"
          aria-labelledby="chart-title chart-desc"
        >
          <title id="chart-title">
            Empréstimos e devoluções nos últimos {period} meses
          </title>
          <desc id="chart-desc">
            {data
              .map(
                (month) =>
                  `${month.label}: ${month.loans} empréstimos e ${month.returns} devoluções`,
              )
              .join('; ')}
            . Outubro representa o cenário até 13/10/2026.
          </desc>
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={value}>
              <text
                x="24"
                y={valueY(value) + 4}
                textAnchor="end"
                className="axis-label"
              >
                {value}
              </text>
              <line
                x1={left}
                x2={chartWidth - 8}
                y1={valueY(value)}
                y2={valueY(value)}
                className="chart-grid"
              />
            </g>
          ))}
          {data.map((month, index) => {
            const center = left + gap * (index + 0.5)
            return (
              <g key={month.label}>
                <rect
                  x={center - 22}
                  y={valueY(month.loans)}
                  width="18"
                  height={(chartHeight * month.loans) / 100}
                  rx="4"
                  fill="#3b6de8"
                >
                  <title>
                    {month.label}: {month.loans} empréstimos
                  </title>
                </rect>
                <rect
                  x={center + 3}
                  y={valueY(month.returns)}
                  width="18"
                  height={(chartHeight * month.returns) / 100}
                  rx="4"
                  fill="#bed1fc"
                >
                  <title>
                    {month.label}: {month.returns} devoluções
                  </title>
                </rect>
                <text
                  x={center}
                  y="207"
                  textAnchor="middle"
                  className="axis-label"
                >
                  {month.label}
                </text>
              </g>
            )
          })}
        </svg>
        <figcaption>Outubro: dados fictícios até 13/10/2026.</figcaption>
      </figure>
      <details className="chart-data">
        <summary>Ver dados do gráfico</summary>
        <DataTable
          headers={['Mês de 2026', 'Empréstimos', 'Devoluções']}
          rows={data.map((month) => [month.label, month.loans, month.returns])}
          label="Valores da movimentação demonstrativa"
        />
      </details>
    </section>
  )
}

export function CollectionOverview({ navigate }: { navigate: Navigate }) {
  const percent = ((availableCopies.length / stats.books) * 100)
    .toFixed(1)
    .replace('.', ',')
  return (
    <section
      className="panel collection-panel"
      aria-labelledby="collection-title"
    >
      <div className="panel-heading">
        <div>
          <h2 id="collection-title">Panorama do acervo</h2>
          <p>Um olhar para os nossos livros</p>
        </div>
        <BookOpen size={19} className="muted-icon" />
      </div>
      <div className="donut-wrapper">
        <svg className="donut" viewBox="0 0 160 160" aria-hidden="true">
          <circle
            cx="80"
            cy="80"
            r="65"
            fill="none"
            stroke="#e8effc"
            strokeWidth="14"
          />
          <circle
            cx="80"
            cy="80"
            r="65"
            fill="none"
            stroke="#3b6de8"
            strokeWidth="14"
            strokeDasharray={`${(availableCopies.length / stats.books) * 408.4} 408.4`}
            transform="rotate(-90 80 80)"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <strong>{percent}%</strong>
          <span>disponíveis</span>
        </div>
      </div>
      <div className="collection-line">
        <span>
          <i className="legend-loans" />
          Disponíveis no cenário
        </span>
        <strong>{formatNumber(availableCopies.length)}</strong>
      </div>
      <div className="collection-line">
        <span>
          <i className="legend-returns" />
          Emprestados
        </span>
        <strong>{stats.open}</strong>
      </div>
      <button
        className="text-button collection-link"
        onClick={() => navigate('livros')}
      >
        Explorar o acervo
        <ArrowRight size={16} />
      </button>
    </section>
  )
}

export function Dashboard({ navigate }: { navigate: Navigate }) {
  const cards = [
    {
      title: 'Livros no acervo',
      value: stats.books,
      icon: LibraryBig,
      tone: 'blue',
      note: `${works.length} obras · exemplares fictícios`,
      page: 'livros' as const,
      query: '',
    },
    {
      title: 'Leitores cadastrados',
      value: stats.readers,
      icon: UsersRound,
      tone: 'violet',
      note: 'Uma comunidade de leitores',
      page: 'leitores' as const,
      query: '',
    },
    {
      title: 'Empréstimos em aberto',
      value: stats.open,
      icon: ArrowUpRight,
      tone: 'teal',
      note: `${stats.dueToday} com vencimento hoje`,
      page: 'emprestimos' as const,
      query: 'aberto',
    },
    {
      title: 'Empréstimos em atraso',
      value: stats.overdue,
      icon: Clock3,
      tone: 'amber',
      note: 'Acompanhe as pendências',
      page: 'emprestimos' as const,
      query: 'atraso',
    },
  ]
  const recentLoans = activeLoans.slice(0, 5)
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="heading-eyebrow">PAINEL DE GESTÃO</div>
          <h1>Dashboard</h1>
          <p>Um olhar sobre a biblioteca. Tudo em um só lugar.</p>
        </div>
        <div className="date-label">
          <CalendarDays size={17} />
          <span>
            13 de outubro de 2026
            <small>Terça-feira · cenário demonstrativo</small>
          </span>
        </div>
      </div>
      <section className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-eyebrow">
            <span />
            BIBLIOTECA PÚBLICA MUNICIPAL DE CIANORTE
          </span>
          <h2>
            Conhecimento que conecta
            <br />
            nossa cidade.
          </h2>
          <p>Cuidar dos livros é abrir caminhos para novas histórias.</p>
          <button
            className="button button-white"
            onClick={() => navigate('emprestimos')}
          >
            Consultar empréstimos
            <ArrowRight size={16} />
          </button>
        </div>
        <img
          src="/library-illustration.svg"
          alt=""
          className="library-illustration"
        />
        <span className="welcome-decoration" aria-hidden="true" />
      </section>
      <div className="stats-grid">
        {cards.map(({ title, value, icon: Icon, tone, note, page, query }) => (
          <button
            className="stat-card"
            key={title}
            onClick={() => navigate(page, query)}
            aria-label={`${title}: ${formatNumber(value)}. Abrir consulta.`}
          >
            <div className="stat-top">
              <span className={`stat-icon tone-${tone}`}>
                <Icon size={21} strokeWidth={1.7} />
              </span>
              <ChevronRight size={16} className="stat-arrow" />
            </div>
            <span className="stat-title">{title}</span>
            <strong>{formatNumber(value)}</strong>
            <span
              className={`stat-note ${tone === 'amber' ? 'amber-note' : ''}`}
            >
              {tone === 'teal' && <span className="tiny-dot" />}
              {note}
            </span>
          </button>
        ))}
      </div>
      <div className="section-label">
        <h2>Acesso rápido</h2>
        <span>Sua rotina, mais simples</span>
      </div>
      <div className="quick-actions">
        {[
          {
            title: 'Empréstimos',
            text: 'Consulte as retiradas',
            icon: ArrowUpRight,
            page: 'emprestimos' as const,
          },
          {
            title: 'Devoluções',
            text: 'Acompanhe os retornos',
            icon: ArrowDownLeft,
            page: 'devolucoes' as const,
          },
          {
            title: 'Renovações',
            text: 'Veja os novos prazos',
            icon: Repeat2,
            page: 'renovacoes' as const,
          },
          {
            title: 'Reservas',
            text: 'Consulte a lista de espera',
            icon: BookMarked,
            page: 'reservas' as const,
          },
        ].map(({ title, text, icon: Icon, page }) => (
          <button
            className="quick-action"
            key={title}
            onClick={() => navigate(page)}
          >
            <span className="quick-icon">
              <Icon size={20} strokeWidth={1.7} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      <div className="analytics-grid">
        <MovementChart />
        <CollectionOverview navigate={navigate} />
      </div>
      <div className="bottom-grid">
        <section className="panel recent-panel" aria-labelledby="recent-title">
          <div className="panel-heading">
            <div>
              <h2 id="recent-title">Empréstimos em destaque</h2>
              <p>Uma amostra das movimentações de outubro</p>
            </div>
            <button
              className="text-button"
              onClick={() => navigate('emprestimos')}
            >
              Ver todos
              <ArrowRight size={15} />
            </button>
          </div>
          <DataTable
            headers={['Leitor', 'Livro', 'Vencimento', 'Situação']}
            label="Amostra de empréstimos fictícios"
            rows={recentLoans.map((loan) => {
              const reader = findReader(loan.readerId)
              const work = workForLoan(loan)
              return [
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
                <span className="date-cell">{formatDate(loan.dueAt)}</span>,
                <Status>{loanStatus(loan)}</Status>,
              ]
            })}
          />
          <div className="table-footnote">
            <span className="tiny-dot" />
            Exibindo 5 de {stats.open} empréstimos em aberto
          </div>
        </section>
        <section
          className="panel attention-panel"
          aria-labelledby="attention-title"
        >
          <div className="panel-heading">
            <div>
              <h2 id="attention-title">Atenção aos prazos</h2>
              <p>Pequenos cuidados fazem a diferença</p>
            </div>
          </div>
          <button
            className="attention-item"
            onClick={() => navigate('emprestimos', 'atraso')}
          >
            <span className="attention-icon tone-amber">
              <TriangleAlert size={20} />
            </span>
            <span>
              <strong>{stats.overdue} empréstimos em atraso</strong>
              <small>Consulte os livros com prazo vencido.</small>
            </span>
            <ChevronRight size={16} />
          </button>
          <button
            className="attention-item"
            onClick={() => navigate('emprestimos', 'hoje')}
          >
            <span className="attention-icon tone-blue">
              <CalendarDays size={20} />
            </span>
            <span>
              <strong>{stats.dueToday} devoluções previstas hoje</strong>
              <small>Veja o que pode voltar às estantes.</small>
            </span>
            <ChevronRight size={16} />
          </button>
          <div className="reading-note">
            <Sparkles size={18} />
            <p>
              Uma biblioteca viva se faz de
              <br />
              <strong>livros em movimento.</strong>
            </p>
          </div>
          <span className="attention-footnote">
            Prazos fictícios para explorar a interface.
          </span>
        </section>
      </div>
    </>
  )
}
