// API Configuration
// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = window.API_URL || 'http://localhost:5001';

// State Management
let requestHistory = [];
let totalRequests = 0;
let cacheHits = 0;
let totalResponseTime = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 NitroCache Dashboard Loaded');
    updateStats();
});

// Get Product Function
async function getProduct() {
    const productId = document.getElementById('getProductId').value;
    
    if (!productId) {
        showError('Please enter a product ID');
        return;
    }

    const startTime = performance.now();
    
    try {
        showLoading('currentResponse');
        
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        const data = await response.json();
        
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        // Determine if it was a cache hit based on backend response
        // Backend returns "from": "cache" when data comes from Redis
        const isCacheHit = data.from === "cache";
        
        // Update metrics
        updateMetrics(responseTime, isCacheHit, response.status);
        
        // Display response
        displayResponse(data, responseTime, isCacheHit);
        
        // Add to log
        addToLog('GET', `/api/products/${productId}`, responseTime, isCacheHit, response.status);
        
    } catch (error) {
        showError(`Failed to fetch product: ${error.message}`);
        addToLog('GET', `/api/products/${productId}`, 0, false, 0, error.message);
    }
}

// Update Product Function
async function updateProduct() {
    const productId = document.getElementById('patchProductId').value;
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    
    if (!productId) {
        showError('Please enter a product ID');
        return;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (description) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
        showError('Please enter at least one field to update');
        return;
    }

    const startTime = performance.now();
    
    try {
        showLoading('currentResponse');
        
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        
        const data = await response.json();
        
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        // Display response
        displayResponse(data, responseTime, false, 'UPDATE');
        
        // Add to log
        addToLog('PATCH', `/api/products/${productId}`, responseTime, false, response.status);
        
        // Clear form
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productDescription').value = '';
        
    } catch (error) {
        showError(`Failed to update product: ${error.message}`);
        addToLog('PATCH', `/api/products/${productId}`, 0, false, 0, error.message);
    }
}

// Run Load Test
async function runLoadTest() {
    const count = parseInt(document.getElementById('loadTestCount').value) || 10;
    const productId = document.getElementById('loadTestId').value || 1;
    
    const progressBar = document.getElementById('loadTestProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressBar.classList.remove('hidden');
    
    const results = {
        total: count,
        completed: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
    };

    const startTime = performance.now();
    
    // Run requests concurrently
    const promises = Array(count).fill(null).map(async (_, index) => {
        try {
            const reqStart = performance.now();
            const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
            const reqEnd = performance.now();
            const reqTime = reqEnd - reqStart;
            
            results.completed++;
            results.totalTime += reqTime;
            results.minTime = Math.min(results.minTime, reqTime);
            results.maxTime = Math.max(results.maxTime, reqTime);
            
            // Cache hit if < 100ms
            if (reqTime < 100) {
                results.cacheHits++;
            } else {
                results.cacheMisses++;
            }
            
            // Update progress
            const progress = (results.completed / count) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${results.completed}/${count}`;
            
        } catch (error) {
            results.completed++;
            results.errors++;
        }
    });
    
    await Promise.all(promises);
    
    const endTime = performance.now();
    const totalDuration = Math.round(endTime - startTime);
    const avgTime = Math.round(results.totalTime / count);
    
    // Display results
    const resultData = {
        message: 'Load Test Complete',
        summary: {
            totalRequests: count,
            completed: results.completed,
            cacheHits: results.cacheHits,
            cacheMisses: results.cacheMisses,
            errors: results.errors,
            totalDuration: `${totalDuration}ms`,
            avgResponseTime: `${avgTime}ms`,
            minTime: `${Math.round(results.minTime)}ms`,
            maxTime: `${Math.round(results.maxTime)}ms`,
            cacheHitRate: `${Math.round((results.cacheHits / count) * 100)}%`,
        }
    };
    
    displayResponse(resultData, totalDuration, results.cacheHits > 0, 'LOAD_TEST');
    
    // Add summary to log
    addToLog('LOAD TEST', `${count} requests to /api/products/${productId}`, totalDuration, results.cacheHits > 0, 200);
    
    // Hide progress bar after a delay
    setTimeout(() => {
        progressBar.classList.add('hidden');
        progressFill.style.width = '0%';
    }, 2000);
}

// Display Response
function displayResponse(data, responseTime, isCacheHit, type = 'GET') {
    const responseBox = document.getElementById('currentResponse');
    
    let html = '<pre>';
    html += JSON.stringify(data, null, 2);
    html += '</pre>';
    
    responseBox.innerHTML = html;
    
    // Update metrics display
    document.getElementById('responseTime').textContent = `${responseTime}ms`;
    document.getElementById('responseTime').className = 'metric-value ' + (responseTime < 100 ? 'success' : responseTime < 500 ? 'warning' : '');
    
    const cacheStatus = document.getElementById('cacheStatus');
    if (type === 'UPDATE' || type === 'LOAD_TEST') {
        cacheStatus.textContent = type === 'UPDATE' ? 'N/A (Write)' : `${data.summary?.cacheHitRate || 'N/A'}`;
        cacheStatus.className = 'metric-value';
    } else {
        cacheStatus.innerHTML = `<span class="cache-badge ${isCacheHit ? 'hit' : 'miss'}">${isCacheHit ? '✓ HIT' : '✗ MISS'}</span>`;
    }
    
    document.getElementById('statusCode').textContent = data.success ? '200 OK' : 'Error';
    document.getElementById('statusCode').className = 'metric-value ' + (data.success ? 'success' : 'error');
    
    document.getElementById('dataSource').textContent = isCacheHit ? 'Redis Cache' : 'PostgreSQL Database';
    document.getElementById('dataSource').className = 'metric-value ' + (isCacheHit ? 'success' : 'warning');
}

// Update Metrics
function updateMetrics(responseTime, isCacheHit, statusCode) {
    totalRequests++;
    totalResponseTime += responseTime;
    
    if (isCacheHit) {
        cacheHits++;
    }
    
    updateStats();
}

// Update Stats Display
function updateStats() {
    const avgTime = totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) : 0;
    const hitRate = totalRequests > 0 ? Math.round((cacheHits / totalRequests) * 100) : 0;
    const boost = avgTime > 0 ? Math.round(2000 / Math.max(avgTime, 1)) : 0;
    
    document.getElementById('avgResponseTime').textContent = `${avgTime}ms`;
    document.getElementById('cacheHitRate').textContent = `${hitRate}%`;
    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('performanceBoost').textContent = `${boost}x`;
}

// Add to Log
function addToLog(method, endpoint, responseTime, isCacheHit, statusCode, error = null) {
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = {
        timestamp,
        method,
        endpoint,
        responseTime,
        isCacheHit,
        statusCode,
        error,
    };
    
    requestHistory.unshift(logEntry);
    
    // Keep only last 50 entries
    if (requestHistory.length > 50) {
        requestHistory = requestHistory.slice(0, 50);
    }
    
    renderLog();
}

// Render Log
function renderLog() {
    const logContainer = document.getElementById('requestLog');
    
    if (requestHistory.length === 0) {
        logContainer.innerHTML = '<p class="placeholder">No requests yet...</p>';
        return;
    }
    
    let html = '';
    requestHistory.forEach(entry => {
        const className = entry.error ? 'error' : entry.isCacheHit ? 'cache-hit' : 'cache-miss';
        const status = entry.error ? 'ERROR' : entry.isCacheHit ? 'CACHE HIT' : 'CACHE MISS';
        
        html += `
            <div class="log-entry ${className}">
                <div class="log-time">${entry.timestamp}</div>
                <div class="log-message">
                    <strong>${entry.method}</strong> ${entry.endpoint}
                </div>
                <div class="log-meta">
                    ${entry.error ? `Error: ${entry.error}` : `${status} • ${entry.responseTime}ms • Status: ${entry.statusCode}`}
                </div>
            </div>
        `;
    });
    
    logContainer.innerHTML = html;
}

// Clear Logs
function clearLogs() {
    requestHistory = [];
    renderLog();
}

// Show Loading
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<p class="placeholder"><span class="spinner"></span> Loading...</p>';
}

// Show Error
function showError(message) {
    const responseBox = document.getElementById('currentResponse');
    responseBox.innerHTML = `<pre style="color: #ef4444;">❌ Error: ${message}</pre>`;
    
    document.getElementById('statusCode').textContent = 'Error';
    document.getElementById('statusCode').className = 'metric-value error';
}

// Allow Enter key to submit
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('getProductId')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getProduct();
    });
    
    document.getElementById('patchProductId')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateProduct();
    });
});
