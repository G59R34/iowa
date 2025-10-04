// Magnitcode Page Interactive Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation
    window.scrollToProjects = function() {
        document.getElementById('projects').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Animated counters for stats
    animateCounters();
    
    // Parallax effect for hero background
    initParallax();
    
    // Form submission handling
    initContactForm();
    
    // Tech stack hover effects
    initTechStackEffects();
});

function animateCounters() {
    const stats = document.querySelectorAll('.stat h3');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent.replace(/[^0-9]/g, '');
                const suffix = target.textContent.replace(/[0-9]/g, '');
                
                animateValue(target, 0, parseInt(finalValue), 2000, suffix);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${parallax}px)`;
        }
    });
}

function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message
            showFormMessage('Thank you for your message! We\'ll get back to you soon. 🚀', 'success');
            
            // Reset form
            contactForm.reset();
            
            // In a real implementation, you would send this data to your backend
            console.log('Form submission:', data);
        });
    }
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 12px;
        text-align: center;
        font-weight: 600;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)'};
        color: ${type === 'success' ? '#00ff88' : '#ff4757'};
        border: 1px solid ${type === 'success' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)'};
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS animation
    if (!document.querySelector('#form-animations')) {
        const style = document.createElement('style');
        style.id = 'form-animations';
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    const contactForm = document.querySelector('.contact-form form');
    contactForm.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function initTechStackEffects() {
    const techItems = document.querySelectorAll('.tech, .skill-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Add glow effect
            item.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4)';
            item.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            // Remove glow effect
            item.style.boxShadow = '';
            item.style.transform = '';
        });
    });
}

// Scroll reveal animations
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll(`
        .team-card,
        .project-card,
        .service-card,
        .skill-category,
        .contact-content
    `);
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        observer.observe(el);
    });
    
    // Add animation CSS
    if (!document.querySelector('#scroll-animations')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations';
        style.textContent = `
            @keyframes slideInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize scroll reveal when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initScrollReveal, 100);
});

// Easter egg: Konami code for special effect
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Create magical effect
    const magicDiv = document.createElement('div');
    magicDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background: linear-gradient(45deg, 
            rgba(0, 255, 136, 0.1), 
            rgba(0, 200, 255, 0.1), 
            rgba(128, 0, 255, 0.1)
        );
        animation: magicPulse 2s ease-in-out;
    `;
    
    // Add magic animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes magicPulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(magicDiv);
    
    // Show special message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(0, 255, 136, 0.9), rgba(0, 200, 255, 0.9));
        color: #000;
        padding: 2rem 3rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        z-index: 10000;
        animation: magicAppear 2s ease-out;
        box-shadow: 0 20px 60px rgba(0, 255, 136, 0.5);
    `;
    message.innerHTML = '🧲✨ Magnitcode Magic Activated! ✨🧲<br><small>You found our secret!</small>';
    
    const appearStyle = document.createElement('style');
    appearStyle.textContent = `
        @keyframes magicAppear {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(appearStyle);
    
    document.body.appendChild(message);
    
    // Remove effects after animation
    setTimeout(() => {
        magicDiv.remove();
        message.remove();
        style.remove();
        appearStyle.remove();
    }, 3000);
    
    // Log to console
    console.log(`
    🧲✨ MAGNITCODE EASTER EGG ACTIVATED! ✨🧲
    
    You discovered our secret Konami code!
    
    Thanks for exploring our development team page.
    Visit https://magnicode.net/ for more amazing projects!
    
    - The Magnitcode Team 💻🚀
    `);
}