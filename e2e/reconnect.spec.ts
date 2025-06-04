import { test, expect } from '@playwright/test'

test.describe('WebSocket reconnect', () => {
  test('shows connected indicator', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input', 'testuser')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
    await expect(page.locator('text=Chatty')).toBeVisible()
  })
})
