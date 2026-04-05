import { test, expect } from '@playwright/test'

test.describe('Geometry puzzle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /custom geometry/i }).click()
  })

  test('shows shape picker with all four shapes', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /choose a shape/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sphere/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /icosahedron/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /torus/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /octahedron/i })).toBeVisible()
  })

  test('shows HUD label and back button on picker', async ({ page }) => {
    await expect(page.getByText(/◈ custom geometry/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /← back/i })).toBeVisible()
  })

  test('back button returns to landing page', async ({ page }) => {
    await page.getByRole('button', { name: /← back/i }).click()
    await expect(page.getByRole('button', { name: /custom geometry/i })).toBeVisible()
  })

  test('selecting a shape shows 3D canvas and zoom slider', async ({ page }) => {
    await page.getByRole('button', { name: /icosahedron/i }).click()
    await expect(page.locator('canvas')).toBeVisible({ timeout: 8000 })
    await expect(page.locator('input[type="range"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /change shape/i })).toBeVisible()
  })

  test('change shape button returns to picker', async ({ page }) => {
    await page.getByRole('button', { name: /sphere/i }).click()
    await expect(page.locator('canvas')).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: /change shape/i }).click()
    await expect(page.getByRole('heading', { name: /choose a shape/i })).toBeVisible()
  })

  test('zoom slider range is correct', async ({ page }) => {
    await page.getByRole('button', { name: /torus/i }).click()
    await expect(page.locator('canvas')).toBeVisible({ timeout: 8000 })
    const slider = page.locator('input[type="range"]')
    await expect(slider).toHaveAttribute('min', '6')
    await expect(slider).toHaveAttribute('max', '30')
  })
})
