import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows the headline and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Generate and solve interactive 3D puzzles')).toBeVisible()
  })

  test('shows both puzzle mode buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /jigsaw puzzle/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /custom geometry/i })).toBeVisible()
  })

  test('shows all three feature cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /interactive 3d/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /two puzzle types/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /browser native/i })).toBeVisible()
  })

  test('shows footer', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toContainText('3D Puzzle Generator')
  })
})
