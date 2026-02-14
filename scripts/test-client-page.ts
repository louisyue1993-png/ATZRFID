import { chromium } from 'playwright';

async function testClientPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Opening products page with filters...');
    await page.goto('http://localhost:5000/products?category=hf-nfc-tags&subcategory=pcb-hf-tags');
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check for "No products found" message
    const noProductsText = await page.textContent('body');
    
    if (noProductsText.includes('No products found')) {
      console.log('❌ Found "No products found" message on the page');
      
      // Check if products were loaded
      const productCards = await page.locator('.ProductCard, [data-testid="product-card"], a[href^="/products/"]').all();
      console.log(`Found ${productCards.length} product cards`);
      
      // Check API calls
      const apiCalls = await page.evaluate(() => {
        return (window as any).__apiCalls || [];
      });
      console.log('API calls:', apiCalls);
      
    } else if (noProductsText.includes('HF PCB Tag')) {
      console.log('✅ Found HF PCB Tag on the page');
    } else {
      console.log('⚠️  Page loaded but unclear state');
    }
    
    // Take screenshot
    await page.screenshot({ path: '/tmp/products-page-test.png', fullPage: true });
    console.log('Screenshot saved to /tmp/products-page-test.png');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testClientPage();
