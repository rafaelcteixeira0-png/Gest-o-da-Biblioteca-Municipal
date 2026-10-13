import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function navigate(page: Page, label: string) {
  const menuButton = page.getByRole('button', {
    name: 'Abrir menu',
    exact: true,
  })
  if (await menuButton.isVisible()) await menuButton.click()
  await page
    .getByRole('navigation', { name: 'Menu principal' })
    .getByRole('link', { name: label, exact: label !== 'Empréstimos' })
    .click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('dashboard apresenta indicadores e gráfico acessível com período ajustável', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard')
  for (const indicator of [
    'Livros no acervo: 1.248',
    'Leitores cadastrados: 286',
    'Empréstimos em aberto: 48',
    'Empréstimos em atraso: 7',
  ]) {
    await expect(
      page.getByRole('button', {
        name: new RegExp(indicator.replace('.', '\\.')),
      }),
    ).toBeVisible()
  }
  await expect(
    page.getByRole('img', {
      name: 'Empréstimos e devoluções nos últimos 6 meses',
    }),
  ).toBeVisible()
  await page.getByLabel('Período do gráfico').selectOption('3')
  await expect(
    page.getByRole('img', {
      name: 'Empréstimos e devoluções nos últimos 3 meses',
    }),
  ).toBeVisible()
  await page.getByText('Ver dados do gráfico', { exact: true }).click()
  await expect(
    page
      .getByRole('region', { name: 'Valores da movimentação demonstrativa' })
      .getByRole('row'),
  ).toHaveCount(4)
})

test('todos os itens do menu abrem suas consultas e o histórico do navegador funciona', async ({
  page,
}) => {
  for (const label of [
    'Empréstimos',
    'Devoluções',
    'Renovações',
    'Reservas',
    'Livros',
    'Leitores',
    'Histórico',
    'Relatórios',
    'Dashboard',
  ]) {
    await navigate(page, label)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(label)
  }
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Relatórios')
})

test('atalho de atrasos, filtro, busca e detalhes usam o mesmo cenário', async ({
  page,
}) => {
  await page
    .getByRole('button', { name: 'Empréstimos em atraso: 7. Abrir consulta.' })
    .click()
  await expect(page.getByLabel('Filtrar empréstimos por situação')).toHaveValue(
    'atraso',
  )
  await expect(
    page
      .getByRole('region', { name: 'Consulta demonstrativa de Empréstimos' })
      .getByRole('row'),
  ).toHaveCount(8)
  await expect(page.getByText('7 registros', { exact: true })).toBeVisible()
  await page
    .getByLabel('Filtrar empréstimos por situação')
    .selectOption('todos')
  await page.getByLabel('Buscar em Empréstimos').fill('EMP-0287')
  await expect(page.getByText('1 registros', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Ver detalhes de EMP-0287' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading')).toHaveText('Empréstimo EMP-0287')
  await expect(dialog.getByText('EX-0001', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await page.getByLabel('Buscar em Empréstimos').fill('sem-resultado-123')
  await expect(
    page.getByText('Nenhum resultado encontrado.', { exact: true }),
  ).toBeVisible()
})

test('busca global encontra obras e leitores e abre a consulta filtrada', async ({
  page,
}) => {
  const search = page.getByLabel('Buscar livros ou leitores')
  await search.fill('mapa')
  await page.getByRole('button', { name: /O mapa das estrelas.*Livro/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Livros')
  await expect(page.locator('.catalog-card')).toHaveCount(1)
  await page
    .getByRole('button', { name: /Literatura brasileira.*O mapa das estrelas/ })
    .click()
  await expect(
    page.getByRole('dialog').getByText('104', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Fechar detalhes' }).click()
  await search.fill('Sofia Martins')
  await page.getByRole('button', { name: /Sofia Martins.*Leitor/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Leitores')
  await expect(page.getByText('1 registros', { exact: true })).toBeVisible()
})

test('paginação de leitores é reiniciada ao buscar um identificador', async ({
  page,
}) => {
  await navigate(page, 'Leitores')
  await expect(
    page.getByText('1–10 de 286 registros', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Próxima página' }).click()
  await expect(
    page.getByText('11–20 de 286 registros', { exact: true }),
  ).toBeVisible()
  await page.getByLabel('Buscar em Leitores').fill('LE-001')
  await expect(
    page.getByText('1–1 de 1 registros', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Próxima página' }),
  ).toBeDisabled()
})

test('alertas abrem a consulta de vencimentos de hoje', async ({ page }) => {
  await page
    .getByRole('button', { name: 'Notificações de demonstração' })
    .click()
  await page.getByRole('button', { name: /6 vencimentos hoje/ }).click()
  await expect(page.getByLabel('Filtrar empréstimos por situação')).toHaveValue(
    'hoje',
  )
  await expect(page.getByText('6 registros', { exact: true })).toBeVisible()
})

test('relatório exporta somente o resumo fictício', async ({ page }) => {
  await navigate(page, 'Relatórios')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar resumo' }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe(
    'resumo-demonstrativo-biblioteca-2026-10-13.csv',
  )
  const stream = await download.createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
  const content = Buffer.concat(chunks).toString('utf8')
  expect(content).toContain('Somente dados fictícios')
  expect(content).toContain('Exemplares cadastrados;1248')
  expect(content).not.toContain('Ana Martins')
})

test('interface cabe em telas estreitas e o menu fecha com Escape', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Sem transbordamento em ${width}px`,
    ).toBe(true)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(
    page.getByRole('dialog', { name: 'Navegação da biblioteca' }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('dialog', { name: 'Navegação da biblioteca' }),
  ).not.toBeVisible()
})

test('página inicial não apresenta erros JavaScript nem solicita serviços externos', async ({
  page,
}) => {
  const errors: string[] = []
  const externalRequests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => {
    if (
      !request.url().startsWith('http://127.0.0.1:4173') &&
      !request.url().startsWith('data:')
    )
      externalRequests.push(request.url())
  })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard')
  await page.evaluate(() => document.fonts.ready)
  expect(errors).toEqual([])
  expect(externalRequests).toEqual([])
})

test('dashboard e consultas passam na verificação automática de acessibilidade', async ({
  page,
}) => {
  for (const route of [
    'dashboard',
    'emprestimos',
    'devolucoes',
    'renovacoes',
    'reservas',
    'livros',
    'leitores',
    'historico',
    'relatorios',
  ]) {
    await page.goto(`/#${route}`)
    await page.evaluate(() => document.fonts.ready)
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(result.violations, `Acessibilidade da tela ${route}`).toEqual([])
  }
})

test('atalho para o conteúdo preserva o módulo e URLs filtradas podem ser reabertas', async ({
  page,
}) => {
  await page.goto('/#emprestimos?busca=atraso')
  await expect(page.getByLabel('Filtrar empréstimos por situação')).toHaveValue(
    'atraso',
  )
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Ir para o conteúdo' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Empréstimos',
  )
  await page.goto('/#livros?busca=OB-001')
  await expect(page.locator('.catalog-card')).toHaveCount(1)
  await page.reload()
  await expect(page.locator('.catalog-card')).toHaveCount(1)
})

test('diálogo de ajuda preserva foco e busca pode ser retomada após Escape', async ({
  page,
}) => {
  const helpButton = page.getByRole('button', { name: 'Sobre este protótipo' })
  await helpButton.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading')).toHaveText(
    'Um novo capítulo para a gestão.',
  )
  await expect(
    dialog.getByRole('button', { name: 'Fechar informações' }),
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(helpButton).toBeFocused()
  const search = page.getByLabel('Buscar livros ou leitores')
  await search.fill('mapa')
  await expect(
    page.getByRole('region', { name: 'Resultados da busca' }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('region', { name: 'Resultados da busca' }),
  ).not.toBeVisible()
  await search.fill('universo')
  await expect(
    page.getByRole('button', { name: /Um universo de ideias.*Livro/ }),
  ).toBeVisible()
})
