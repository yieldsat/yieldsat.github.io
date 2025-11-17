// Main JavaScript file for Yield Prediction Dataset website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Yield Prediction Dataset website loaded');
    
    // Initialize the website
    initializeWebsite();
});

/**
 * Initialize website functionality
 */
function initializeWebsite() {
    setupVisualizationLoading();
    setupScrollAnimations();
    setupImageLazyLoading();
    setupErrorHandling();
}

/**
 * Setup visualization iframe loading with error handling
 */
function setupVisualizationLoading() {
    const iframes = document.querySelectorAll('.viz-item iframe');
    
    iframes.forEach((iframe, index) => {
        // Add loading indicator
        const loadingDiv = createLoadingIndicator();
        iframe.parentNode.insertBefore(loadingDiv, iframe);
        
        // Handle iframe load events
        iframe.addEventListener('load', function() {
            loadingDiv.style.display = 'none';
            iframe.style.opacity = '1';
            console.log(`Visualization ${index + 1} loaded successfully`);
        });
        
        iframe.addEventListener('error', function() {
            handleVisualizationError(iframe, loadingDiv, index + 1);
        });
        
        // Set initial opacity for smooth loading
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 0.3s ease';
    });
}

/**
 * Create a loading indicator element
 */
function createLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = `
        <div class="spinner"></div>
        <p>Loading visualization...</p>
    `;
    loadingDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 400px;
        background: #f8f9fa;
        border-radius: 6px;
        color: #666;
        font-size: 14px;
    `;
    
    // Add spinner CSS
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e9ecef;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    return loadingDiv;
}

/**
 * Handle visualization loading errors
 */
function handleVisualizationError(iframe, loadingDiv, vizNumber) {
    console.warn(`Failed to load visualization ${vizNumber}`);
    
    loadingDiv.innerHTML = `
        <div class="error-icon">⚠️</div>
        <p>Visualization ${vizNumber} unavailable</p>
        <button class="retry-btn" onclick="retryVisualization('${iframe.src}', this)">Retry</button>
    `;
    loadingDiv.style.background = '#fff3cd';
    loadingDiv.style.border = '1px solid #ffeaa7';
}

/**
 * Retry loading a visualization
 */
function retryVisualization(src, button) {
    const loadingDiv = button.closest('.loading-indicator');
    const iframe = loadingDiv.nextElementSibling;
    
    // Reset loading state
    loadingDiv.innerHTML = `
        <div class="spinner"></div>
        <p>Loading visualization...</p>
    `;
    loadingDiv.style.background = '#f8f9fa';
    loadingDiv.style.border = 'none';
    
    // Reload iframe
    iframe.src = '';
    setTimeout(() => {
        iframe.src = src;
    }, 100);
}

/**
 * Setup scroll animations for sections
 */
function setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/**
 * Setup lazy loading for images
 */
function setupImageLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading class
                img.classList.add('loading');
                
                // Handle image load
                img.addEventListener('load', function() {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                });
                
                // Handle image error
                img.addEventListener('error', function() {
                    img.classList.remove('loading');
                    img.classList.add('error');
                    img.alt = 'Image failed to load';
                });
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add CSS for image states
    const imageStyle = document.createElement('style');
    imageStyle.textContent = `
        img.loading {
            opacity: 0.5;
            filter: blur(5px);
        }
        img.loaded {
            opacity: 1;
            filter: none;
            transition: opacity 0.3s ease, filter 0.3s ease;
        }
        img.error {
            opacity: 0.5;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
        }
    `;
    document.head.appendChild(imageStyle);
}

/**
 * Setup global error handling
 */
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('Global error:', event.error);
        
        // Log error details for debugging
        const errorInfo = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        };
        
        console.error('Error details:', errorInfo);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
    });
}

/**
 * Utility function to check if an element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Analytics and tracking functions
 */
function trackVisualizationView(vizName) {
    console.log(`Visualization viewed: ${vizName}`);
    // Add analytics tracking here if needed
}

function trackDownload(fileName) {
    console.log(`File downloaded: ${fileName}`);
    // Add analytics tracking here if needed
}

// Export functions for global access
window.YieldPredictionDataset = {
    scrollToSection,
    trackVisualizationView,
    trackDownload,
    retryVisualization
};