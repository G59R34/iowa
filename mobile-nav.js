// Mobile-friendly navigation component
class MobileNav {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Create mobile navigation structure
        this.createNav();
        this.bindEvents();
        this.setupTouchHandlers();
    }

    createNav() {
        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';
        nav.innerHTML = `
            <div class="nav-header">
                <div class="nav-logo">🛑 Anti-Iowa Cult 🛑</div>
                <button class="nav-toggle" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <div class="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="evidence.html" class="nav-link">Evidence</a>
                <a href="drama.html" class="nav-link">Cult Drama</a>
                <a href="sniffles.html" class="nav-link">Sniffles</a>
                <a href="linda.html" class="nav-link">Linda</a>
                <a href="mrs-sniffles.html" class="nav-link">Mrs. Sniffles</a>
                <a href="turn-signal.html" class="nav-link">Turn Signal</a>
                <a href="united.html" class="nav-link">United Airlines</a>
                <a href="tesla.html" class="nav-link">Tesla Mode</a>
                <a href="game.html" class="nav-link">Experience Iowa</a>
                <a href="join.html" class="nav-link">Join</a>
                <a href="login.html" class="nav-link">LOG TF IN</a>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-nav {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: linear-gradient(90deg, #ffefc1 0%, #ffe066 100%);
                box-shadow: 0 2px 8px rgba(0,0,0,0.12);
                z-index: 1000;
                font-family: 'Orbitron', 'Comic Neue', cursive, sans-serif;
                transition: all 0.3s ease;
            }

            .nav-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75em 1em;
            }

            .nav-logo {
                font-size: clamp(1em, 4vw, 1.3em);
                font-weight: bold;
                color: #222;
                text-shadow: 0 0 8px #ffe066;
            }

            .nav-toggle {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                width: 30px;
                height: 30px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                z-index: 10;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .nav-toggle span {
                width: 100%;
                height: 3px;
                background: #222;
                border-radius: 2px;
                transition: all 0.3s ease;
                transform-origin: center;
            }

            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }

            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }

            .nav-menu {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background: rgba(255,255,255,0.95);
                border-top: 1px solid #ffe066;
            }

            .nav-menu.open {
                max-height: 80vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }

            .nav-link {
                display: block;
                padding: 0.8em 1.2em;
                color: #222;
                text-decoration: none;
                font-weight: bold;
                font-size: clamp(0.9em, 3.5vw, 1em);
                border-bottom: 1px solid #ffe066;
                transition: background 0.2s ease;
                min-height: 44px;
                display: flex;
                align-items: center;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .nav-link:hover,
            .nav-link:focus {
                background: #ffe066;
                color: #d35400;
            }

            .nav-link.active {
                background: #ffe066;
                color: #d35400;
                font-weight: bold;
            }

            /* Mobile-first responsive design */
            @media (max-width: 768px) {
                .nav-header {
                    padding: 0.6em 0.8em;
                }

                .nav-logo {
                    font-size: clamp(0.9em, 3.5vw, 1.2em);
                }

                .nav-toggle {
                    width: 28px;
                    height: 28px;
                }

                .nav-toggle span {
                    height: 2.5px;
                }

                .nav-link {
                    padding: 0.7em 1em;
                    font-size: clamp(0.85em, 3.2vw, 0.95em);
                    min-height: 40px;
                }
            }

            @media (max-width: 480px) {
                .nav-header {
                    padding: 0.5em 0.6em;
                }

                .nav-logo {
                    font-size: clamp(0.8em, 3vw, 1.1em);
                }

                .nav-toggle {
                    width: 26px;
                    height: 26px;
                }

                .nav-toggle span {
                    height: 2px;
                }

                .nav-link {
                    padding: 0.6em 0.8em;
                    font-size: clamp(0.8em, 3vw, 0.9em);
                    min-height: 36px;
                }
            }

            @media (max-width: 360px) {
                .nav-header {
                    padding: 0.4em 0.5em;
                }

                .nav-logo {
                    font-size: clamp(0.75em, 2.8vw, 1em);
                }

                .nav-toggle {
                    width: 24px;
                    height: 24px;
                }

                .nav-toggle span {
                    height: 1.8px;
                }

                .nav-link {
                    padding: 0.5em 0.7em;
                    font-size: clamp(0.75em, 2.8vw, 0.85em);
                    min-height: 32px;
                }
            }

            /* Landscape orientation adjustments */
            @media (orientation: landscape) and (max-height: 500px) {
                .nav-header {
                    padding: 0.4em 0.8em;
                }

                .nav-logo {
                    font-size: clamp(0.8em, 2.5vw, 1em);
                }

                .nav-link {
                    padding: 0.4em 0.8em;
                    font-size: clamp(0.7em, 2.2vw, 0.8em);
                    min-height: 28px;
                }
            }

            /* Touch-friendly improvements */
            @media (hover: none) and (pointer: coarse) {
                .nav-link:hover {
                    background: transparent;
                    color: #222;
                }

                .nav-link:active {
                    background: #ffe066;
                    color: #d35400;
                }

                * {
                    -webkit-overflow-scrolling: touch;
                }
            }

            /* High DPI displays */
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                .nav-toggle span {
                    border-width: 0.5px;
                }
            }

            /* Print styles */
            @media print {
                .mobile-nav {
                    display: none !important;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.insertBefore(nav, document.body.firstChild);

        // Add padding to body to account for fixed nav
        document.body.style.paddingTop = '60px';
    }

    bindEvents() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');
        const links = document.querySelectorAll('.nav-link');

        toggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-nav') && this.isOpen) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Set active link based on current page
        this.setActiveLink();
    }

    setupTouchHandlers() {
        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelectorAll('.nav-link');

        // Prevent double-tap zoom on mobile
        toggle.addEventListener('touchend', (e) => {
            e.preventDefault();
        });

        links.forEach(link => {
            link.addEventListener('touchend', (e) => {
                e.preventDefault();
                link.click();
            });
        });
    }

    toggleMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        toggle.classList.add('active');
        menu.classList.add('open');
        this.isOpen = true;

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');

        toggle.classList.remove('active');
        menu.classList.remove('open');
        this.isOpen = false;

        // Restore body scroll
        document.body.style.overflow = '';
    }

    setActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-link');

        links.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileNav();
});

// Export for use in other scripts
window.MobileNav = MobileNav; 