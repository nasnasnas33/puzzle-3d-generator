import { test, expect } from '@playwright/test'

test.describe('Jigsaw puzzle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /jigsaw puzzle/i }).click()
  })

  test('shows uploader screen with drop zone and demo buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /upload an image/i })).toBeVisible()
    await expect(page.getByText(/drop image here/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Mountains' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ocean' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Forest' })).toBeVisible()
  })

  test('shows HUD label and back button on uploader', async ({ page }) => {
    await expect(page.getByText(/⬡ jigsaw puzzle/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible()
  })

  test('back button returns to landing page', async ({ page }) => {
    await page.getByRole('button', { name: /← back/i }).click()
    await expect(page.getByRole('button', { name: /jigsaw puzzle/i })).toBeVisible()
  })

  test('loading a demo image shows the 3D canvas and zoom slider', async ({ page }) => {
    await page.getByRole('button', { name: 'Mountains' }).click()
    // Wait for canvas to appear
    await expect(page.locator('canvas')).toBeVisible({ timeout: 8000 })
    // Zoom slider should appear in HUD
    await expect(page.locator('input[type="range"]')).toBeVisible()
    // New Image button should appear
    await expect(page.getByRole('button', { name: /new image/i })).toBeVisible()
  })

  test('new image button returns to uploader', async ({ page }) => {
    await page.getByRole('button', { name: 'Mountains' }).click()
    await expect(page.locator('canvas')).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: /new image/i }).click()
    await expect(page.getByRole('heading', { name: /upload an image/i })).toBeVisible()
  })

  test('zoom slider is within expected range', async ({ page }) => {
    await page.getByRole('button', { name: 'Ocean' }).click()
    await expect(page.locator('canvas')).toBeVisible({ timeout: 8000 })
    const slider = page.locator('input[type="range"]')
    await expect(slider).toHaveAttribute('min', '6')
    await expect(slider).toHaveAttribute('max', '30')
  })
})
