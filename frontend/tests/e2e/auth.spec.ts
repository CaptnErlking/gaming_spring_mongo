import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login as user and navigate to dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="tel"]', '9876543210');
    await page.selectOption('select', 'USER');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL('/dashboard');
    
    // Verify dashboard content
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

  test('should login as admin and navigate to admin dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="tel"]', '1234567890');
    await page.selectOption('select', 'ADMIN');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL('/dashboard');
    
    // Navigate to admin panel
    await page.click('text=Admin Panel');
    await page.waitForURL('/admin/dashboard');
    
    // Verify admin dashboard
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should logout and redirect to login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="tel"]', '9876543210');
    await page.selectOption('select', 'USER');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Logout
    await page.click('button:has-text("Logout")');
    await page.waitForURL('/login');
    
    // Verify login page
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });
});
