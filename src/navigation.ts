import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  Clock3,
  LayoutDashboard,
  LibraryBig,
  Repeat2,
  UsersRound,
} from 'lucide-react'

export const navigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'PRINCIPAL',
  },
  {
    id: 'emprestimos',
    label: 'Empréstimos',
    icon: ArrowUpRight,
    group: 'PRINCIPAL',
  },
  {
    id: 'devolucoes',
    label: 'Devoluções',
    icon: ArrowDownLeft,
    group: 'PRINCIPAL',
  },
  { id: 'renovacoes', label: 'Renovações', icon: Repeat2, group: 'PRINCIPAL' },
  { id: 'reservas', label: 'Reservas', icon: BookOpen, group: 'PRINCIPAL' },
  { id: 'livros', label: 'Livros', icon: LibraryBig, group: 'CADASTROS' },
  { id: 'leitores', label: 'Leitores', icon: UsersRound, group: 'CADASTROS' },
  { id: 'historico', label: 'Histórico', icon: Clock3, group: 'ANÁLISE' },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: ChartNoAxesCombined,
    group: 'ANÁLISE',
  },
] as const

export type Page = (typeof navigation)[number]['id']
export type Navigate = (page: Page, search?: string) => void
export function pageFromHash(): Page {
  return (
    navigation.find(
      (item) => item.id === window.location.hash.slice(1).split('?')[0],
    )?.id ?? 'dashboard'
  )
}

export function searchFromHash(): string {
  return (
    new URLSearchParams(window.location.hash.split('?')[1] ?? '').get(
      'busca',
    ) ?? ''
  )
}
