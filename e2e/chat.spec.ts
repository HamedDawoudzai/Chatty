import { test, expect } from '@playwright/test'

test.describe('Chat flow', () => {
  test('user can register, login, and see chat layout', async ({ page }) => {
    await page.goto('/register')
    await page.fill('input[type="text"]', 'e2euser')
    await page.fill('input[type="email"]', 'e2e@test.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Chatty')).toBeVisible()
  })
})
