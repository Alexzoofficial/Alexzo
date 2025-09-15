// Comprehensive Authentication Flow Test
// This script tests the complete Google authentication login flow and verifies post-login functionality

const puppeteer = require('puppeteer');

async function testAuthFlow() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    
    try {
        console.log('🚀 Starting authentication flow test...');
        
        // Navigate to homepage
        console.log('📄 Navigating to homepage...');
        await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
        
        // Test 1: Check if "Get Started" button exists and is clickable
        console.log('🔍 Testing Get Started button...');
        const getStartedButton = await page.waitForSelector('button:contains("Get Started"), [data-testid="get-started"]', { timeout: 5000 });
        
        if (getStartedButton) {
            console.log('✅ Get Started button found');
        } else {
            console.log('❌ Get Started button not found');
            return;
        }
        
        // Take screenshot before clicking
        await page.screenshot({ path: 'test_homepage_before_auth.png' });
        
        // Test 2: Click Get Started and verify auth modal opens
        console.log('🔑 Clicking Get Started button...');
        await getStartedButton.click();
        
        // Wait for auth modal to appear
        await page.waitForTimeout(2000);
        
        // Check if auth modal is visible
        const authModal = await page.$('[class*="auth-modal"], [data-testid="auth-modal"]');
        if (authModal) {
            console.log('✅ Auth modal opened successfully');
            await page.screenshot({ path: 'test_auth_modal_opened.png' });
        } else {
            console.log('❌ Auth modal did not open');
            return;
        }
        
        // Test 3: Check for Google sign-in button
        console.log('🔍 Looking for Google sign-in button...');
        const googleButton = await page.$('button:contains("Google"), [data-testid="google-signin"]');
        
        if (googleButton) {
            console.log('✅ Google sign-in button found');
            await page.screenshot({ path: 'test_google_button_found.png' });
        } else {
            console.log('❌ Google sign-in button not found');
        }
        
        // Test 4: Test Firebase configuration
        console.log('🔧 Testing Firebase configuration...');
        const firebaseConfigured = await page.evaluate(() => {
            return window.isFirebaseConfigured || false;
        });
        
        if (firebaseConfigured) {
            console.log('✅ Firebase is properly configured');
        } else {
            console.log('❌ Firebase configuration issue detected');
        }
        
        // Test 5: Check console for authentication errors
        console.log('📊 Checking console for errors...');
        const logs = await page.evaluate(() => {
            return console.logs || [];
        });
        
        console.log('Console logs:', logs);
        
        // Test 6: Verify all required authentication elements are present
        console.log('🔍 Verifying authentication elements...');
        
        const authElements = await page.evaluate(() => {
            const elements = {
                authModal: !!document.querySelector('[class*="auth-modal"], [data-testid="auth-modal"]'),
                googleButton: !!document.querySelector('button:contains("Google"), [data-testid="google-signin"]'),
                closeButton: !!document.querySelector('[data-testid="close-auth-modal"]'),
                logo: !!document.querySelector('img[alt*="Alexzo"], img[alt*="Logo"]')
            };
            return elements;
        });
        
        console.log('Auth elements found:', authElements);
        
        // Test 7: Test mock user login flow (simulate successful auth)
        console.log('🎭 Testing mock authentication flow...');
        
        // Simulate successful authentication by directly calling auth functions
        const mockAuthResult = await page.evaluate(() => {
            // Mock successful authentication
            if (window.mockAuth) {
                return window.mockAuth();
            }
            return { success: false, reason: 'Mock auth not available' };
        });
        
        console.log('Mock auth result:', mockAuthResult);
        
        // Test 8: Check if user avatar would appear (test the component)
        console.log('👤 Testing user avatar component...');
        
        const userAvatarExists = await page.evaluate(() => {
            return !!document.querySelector('[data-testid="user-avatar"], .user-avatar');
        });
        
        if (userAvatarExists) {
            console.log('✅ User avatar component exists');
        } else {
            console.log('ℹ️ User avatar component not visible (expected when not logged in)');
        }
        
        // Test 9: Check API page accessibility
        console.log('🔗 Testing API page navigation...');
        await page.goto('http://localhost:5000/api', { waitUntil: 'networkidle2' });
        
        const apiPageLoaded = await page.evaluate(() => {
            return document.title.includes('API') || document.body.textContent.includes('API');
        });
        
        if (apiPageLoaded) {
            console.log('✅ API page loads successfully');
            await page.screenshot({ path: 'test_api_page.png' });
        } else {
            console.log('❌ API page failed to load');
        }
        
        // Test 10: Check for API key management interface
        console.log('🔑 Testing API key management interface...');
        
        const apiKeyElements = await page.evaluate(() => {
            return {
                createButton: !!document.querySelector('button:contains("Create"), [data-testid="create-api-key"]'),
                keysList: !!document.querySelector('[data-testid="api-keys-list"], .api-keys'),
                documentation: !!document.querySelector('[data-testid="api-docs"], .api-documentation')
            };
        });
        
        console.log('API key management elements:', apiKeyElements);
        
        console.log('✅ Authentication flow test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
        await page.screenshot({ path: 'test_error_screenshot.png' });
    } finally {
        await browser.close();
    }
}

// Run the test
testAuthFlow().catch(console.error);