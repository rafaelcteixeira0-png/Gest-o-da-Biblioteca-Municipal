// Cenário inteiramente sintético. Nenhum registro veio da planilha da biblioteca.
export const DEMO_TODAY = '2026-10-13'
export const DEMO_YEAR = 2026

export interface Work {
  id: string
  title: string
  author: string
  category: string
  color: string
}

export interface Copy {
  id: string
  workId: string
  shelf: string
}

export interface Reader {
  id: string
  name: string
  joinedAt: string
}

export interface LoanItem {
  copyId: string
  returnedAt?: string
}

export interface Loan {
  id: string
  readerId: string
  borrowedAt: string
  dueAt: string
  items: LoanItem[]
}

export interface Renewal {
  id: string
  loanId: string
  occurredAt: string
  previousDueAt: string
  newDueAt: string
}

export interface Reservation {
  id: string
  readerId: string
  workId: string
  requestedAt: string
  state: 'Aguardando' | 'Retirada' | 'Cancelada'
}

export const works: Work[] = [
  {
    id: 'OB-001',
    title: 'O mapa das estrelas',
    author: 'Clara Monteiro',
    category: 'Literatura brasileira',
    color: 'blue',
  },
  {
    id: 'OB-002',
    title: 'Jardins do amanhã',
    author: 'Lia Figueiredo',
    category: 'Ficção',
    color: 'sage',
  },
  {
    id: 'OB-003',
    title: 'Entre rios e memórias',
    author: 'Tomás Avelar',
    category: 'Literatura brasileira',
    color: 'sand',
  },
  {
    id: 'OB-004',
    title: 'A casa das palavras',
    author: 'Nina Valença',
    category: 'Infantojuvenil',
    color: 'rose',
  },
  {
    id: 'OB-005',
    title: 'Pequenas grandes descobertas',
    author: 'Raul Siqueira',
    category: 'Ciências',
    color: 'teal',
  },
  {
    id: 'OB-006',
    title: 'O tempo de cada coisa',
    author: 'Cecília Amaral',
    category: 'Poesia',
    color: 'violet',
  },
  {
    id: 'OB-007',
    title: 'Histórias de um lugar',
    author: 'Davi Lacerda',
    category: 'História',
    color: 'sand',
  },
  {
    id: 'OB-008',
    title: 'A viagem do pequeno sol',
    author: 'Marina Veras',
    category: 'Infantojuvenil',
    color: 'blue',
  },
  {
    id: 'OB-009',
    title: 'Caminhos de papel',
    author: 'Bruno Alencastro',
    category: 'Ficção',
    color: 'rose',
  },
  {
    id: 'OB-010',
    title: 'Além do horizonte',
    author: 'Luna Paiva',
    category: 'Literatura brasileira',
    color: 'teal',
  },
  {
    id: 'OB-011',
    title: 'O segredo do bosque',
    author: 'Artur Fontes',
    category: 'Infantojuvenil',
    color: 'sage',
  },
  {
    id: 'OB-012',
    title: 'Um universo de ideias',
    author: 'Íris Brandão',
    category: 'Ciências',
    color: 'violet',
  },
]

export const copies: Copy[] = Array.from({ length: 1248 }, (_, index) => ({
  id: `EX-${String(index + 1).padStart(4, '0')}`,
  workId: works[index % works.length].id,
  shelf: `Estante ${String.fromCharCode(65 + (index % 6))} · ${1 + (index % 4)}`,
}))

const firstNames = [
  'Ana',
  'Lucas',
  'Beatriz',
  'Pedro',
  'Helena',
  'Miguel',
  'Sofia',
  'Gabriel',
  'Laura',
  'Rafael',
  'Alice',
  'Daniel',
  'Isabela',
  'Theo',
  'Cecília',
  'Arthur',
  'Lara',
  'Samuel',
  'Marina',
  'Davi',
  'Elisa',
  'Nicolas',
]
const lastNames = [
  'Martins',
  'Oliveira',
  'Costa',
  'Almeida',
  'Ribeiro',
  'Santos',
  'Pereira',
  'Lima',
  'Barbosa',
  'Rocha',
  'Azevedo',
  'Mendes',
  'Castro',
]

export const readers: Reader[] = Array.from({ length: 286 }, (_, index) => ({
  id: `LE-${String(index + 1).padStart(3, '0')}`,
  name: `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length)]}`,
  joinedAt: `2026-0${1 + (index % 8)}-${String(1 + (index % 27)).padStart(2, '0')}`,
}))

const historicalCounts = [42, 58, 51, 72, 63]
let historicalIndex = 0
const historicalLoans: Loan[] = historicalCounts.flatMap((count, monthIndex) =>
  Array.from({ length: count }, (_, index) => {
    const sequence = historicalIndex++
    const month = String(monthIndex + 5).padStart(2, '0')
    const day = String(1 + (index % 16)).padStart(2, '0')
    const returnedAt = `2026-${month}-${String(12 + (index % 16)).padStart(2, '0')}`
    return {
      id: `EMP-${String(sequence + 1).padStart(4, '0')}`,
      readerId: readers[sequence % readers.length].id,
      borrowedAt: `2026-${month}-${day}`,
      dueAt: `2026-${month}-${String(14 + (index % 14)).padStart(2, '0')}`,
      items: [
        { copyId: copies[(sequence + 100) % copies.length].id, returnedAt },
      ],
    }
  }),
)

const overdueIndices = new Set([2, 5, 8, 11, 14, 17, 20])
const todayIndices = new Set([1, 6, 16, 25, 30, 39])
const tomorrowIndices = new Set([4, 10, 22, 34])

export const activeLoans: Loan[] = Array.from({ length: 48 }, (_, index) => ({
  id: `EMP-${String(287 + index).padStart(4, '0')}`,
  readerId: readers[index].id,
  borrowedAt: `2026-10-${String(1 + (index % 5)).padStart(2, '0')}`,
  // Datas específicas do cenário de demonstração; não são uma política de prazo.
  dueAt: overdueIndices.has(index)
    ? `2026-10-${String(7 + (index % 5)).padStart(2, '0')}`
    : todayIndices.has(index)
      ? DEMO_TODAY
      : tomorrowIndices.has(index)
        ? '2026-10-14'
        : `2026-10-${String(16 + (index % 10)).padStart(2, '0')}`,
  items: [{ copyId: copies[index].id }],
}))

export const loans: Loan[] = [...activeLoans, ...[...historicalLoans].reverse()]
export const renewals: Renewal[] = activeLoans
  .slice(24, 32)
  .map((loan, index) => ({
    id: `REN-${String(index + 1).padStart(3, '0')}`,
    loanId: loan.id,
    occurredAt: '2026-10-10',
    previousDueAt: '2026-10-12',
    newDueAt: loan.dueAt,
  }))

export const reservations: Reservation[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `RES-${String(index + 1).padStart(3, '0')}`,
    readerId: readers[index + 60].id,
    workId: works[index + 3].id,
    requestedAt: `2026-10-${String(8 + index).padStart(2, '0')}`,
    state: index === 5 ? 'Retirada' : 'Aguardando',
  }),
)

export const findReader = (id: string) =>
  readers.find((reader) => reader.id === id)!
export const findCopy = (id: string) => copies.find((copy) => copy.id === id)!
export const findWork = (id: string) => works.find((work) => work.id === id)!
export const workForLoan = (loan: Loan) =>
  findWork(findCopy(loan.items[0].copyId).workId)

export function loanStatus(
  loan: Loan,
): 'Em aberto' | 'Em atraso' | 'Devolvido' {
  if (loan.items.every((item) => item.returnedAt)) return 'Devolvido'
  return loan.dueAt < DEMO_TODAY ? 'Em atraso' : 'Em aberto'
}

export const availableCopies = copies.filter(
  (copy) =>
    !loans.some((loan) =>
      loan.items.some((item) => item.copyId === copy.id && !item.returnedAt),
    ),
)

export const stats = {
  books: copies.length,
  readers: readers.length,
  open: loans.filter((loan) => loanStatus(loan) !== 'Devolvido').length,
  overdue: loans.filter((loan) => loanStatus(loan) === 'Em atraso').length,
  dueToday: activeLoans.filter((loan) => loan.dueAt === DEMO_TODAY).length,
  dueTomorrow: activeLoans.filter((loan) => loan.dueAt === '2026-10-14').length,
  returned: loans.filter((loan) => loanStatus(loan) === 'Devolvido').length,
}

export const monthlyMovement = Array.from({ length: 6 }, (_, index) => {
  const month = `2026-${String(index + 5).padStart(2, '0')}`
  return {
    label: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'][index],
    loans: loans.filter((loan) => loan.borrowedAt.startsWith(month)).length,
    returns: loans.filter((loan) =>
      loan.items.some((item) => item.returnedAt?.startsWith(month)),
    ).length,
  }
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })
export const formatDate = (value: string) =>
  dateFormatter.format(new Date(`${value}T12:00:00Z`))
export const formatNumber = (value: number) =>
  new Intl.NumberFormat('pt-BR').format(value)
export const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
