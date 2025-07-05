import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the development server to be ready
    console.log('⏳ Waiting for development server...');
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3002';
    
    // Try to reach the server with retries
    let retries = 30;
    while (retries > 0) {
      try {
        const response = await page.goto(baseURL);
        if (response && response.ok()) {
          console.log('✅ Development server is ready');
          break;
        }
      } catch (error) {
        console.log(`⏳ Waiting for server... (${retries} retries left)`);
        await page.waitForTimeout(2000);
        retries--;
      }
    }

    if (retries === 0) {
      throw new Error('❌ Development server failed to start within timeout');
    }

    // Pre-warm the application by visiting key pages
    console.log('🔥 Pre-warming application...');
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Pre-load any critical data
    await page.evaluate(() => {
      // Any client-side setup can go here
      localStorage.setItem('test-mode', 'true');
    });

    console.log('✅ Global setup completed successfully');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;