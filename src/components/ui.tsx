import { ArrowLeft, ArrowRight, BookOpen, Search } from 'lucide-react'
import type { ReactNode } from 'react'

export function Status({ children }: { children: string }) {
  const tone =
    children === 'Em atraso'
      ? 'danger'
      : children === 'Devolvido' || children === 'Retirada'
        ? 'success'
        : children === 'Aguardando'
          ? 'warning'
          : children === 'Cancelada'
            ? 'muted'
            : 'info'
  return (
    <span className={`status status-${tone}`}>
      <span />
      {children}
    </span>
  )
}

export function BookCover({
  title,
  color = 'blue',
  small = false,
}: {
  title: string
  color?: string
  small?: boolean
}) {
  return (
    <span
      className={`book-cover cover-${color} ${small ? 'cover-small' : ''}`}
      aria-hidden="true"
    >
      <BookOpen size={small ? 15 : 22} strokeWidth={1.4} />
      {!small && <span>{title}</span>}
    </span>
  )
}

export function DataTable({
  headers,
  rows,
  label,
  empty = 'Nenhum resultado encontrado.',
}: {
  headers: string[]
  rows: ReactNode[][]
  label: string
  empty?: string
}) {
  return (
    <div className="table-scroll" role="region" aria-label={label} tabIndex={0}>
      <table>
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th scope="col" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty-state" colSpan={headers.length}>
                <Search size={28} />
                <strong>{empty}</strong>
                <span>Tente outro nome, título ou código.</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({
  count,
  page,
  onChange,
  size = 10,
}: {
  count: number
  page: number
  onChange: (page: number) => void
  size?: number
}) {
  const pages = Math.max(1, Math.ceil(count / size))
  return (
    <div className="pagination">
      <span>
        {count
          ? `${(page - 1) * size + 1}–${Math.min(page * size, count)} de ${count} registros`
          : '0 registros'}
      </span>
      <div>
        <button
          className="icon-button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ArrowLeft size={16} />
        </button>
        <span>
          Página {page} de {pages}
        </span>
        <button
          className="icon-button"
          aria-label="Próxima página"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
