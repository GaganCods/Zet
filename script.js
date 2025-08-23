
<script type='text/javascript' src='//pl27484094.profitableratecpm.com/05/92/e0/0592e091866d1399be0cd1a2882fc58b.js'></script>


// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const searchToggle = document.getElementById('search-toggle');
const searchBox = document.getElementById('search-box');
const navbar = document.getElementById('navbar');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    init() {
        this.setTheme(this.currentTheme);
        this.updateThemeIcon();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to light mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to dark mode';
        }
    }
}

// Share buttons (Twitter, LinkedIn, Copy link)
class ShareManager {
    constructor() { this.init(); }
    init() {
        const shareBars = document.querySelectorAll('.share-bar');
        if (!shareBars.length) return;
        shareBars.forEach(bar => this.bindBar(bar));
    }
    bindBar(bar) {
        const url = window.location.href;
        const title = document.title;
        const tip = bar.querySelector('.copy-tip');
        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(url);
                if (tip) { tip.classList.add('visible'); setTimeout(() => tip.classList.remove('visible'), 1500); }
            } catch (e) {
                const input = document.createElement('input');
                input.value = url; document.body.appendChild(input); input.select(); document.execCommand('copy'); document.body.removeChild(input);
                if (tip) { tip.classList.add('visible'); setTimeout(() => tip.classList.remove('visible'), 1500); }
            }
        };
        bar.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-share');
                if (type === 'copy') return handleCopy();
                if (type === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'noopener,noreferrer');
                if (type === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                if (type === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
                if (type === 'whatsapp') {
                    const text = `${title} ${url}`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                }
            });
        });
    }
}

// Collapsible blog sidebar (mobile)
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('blog-sidebar');
        this.toggleBtn = document.getElementById('sidebar-toggle');
        this.init();
    }
    init() {
        if (!this.sidebar || !this.toggleBtn) return;
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
    handleResize() {
        const isMobile = window.innerWidth <= 1024;
        this.sidebar.classList.remove('collapsed');
        this.toggleBtn.setAttribute('aria-expanded', 'true');
        if (!isMobile) this.sidebar.classList.remove('collapsed');
    }
    toggle() {
        const isCollapsed = this.sidebar.classList.toggle('collapsed');
        this.toggleBtn.setAttribute('aria-expanded', String(!isCollapsed));
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        hamburger.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                this.close();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    close() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSearchData();
    }

    bindEvents() {
        if (searchToggle && searchBox) {
            searchToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }

        // Close search when clicking outside
        if (searchToggle && searchBox) {
            document.addEventListener('click', (e) => {
                if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
                    this.close();
                }
            });
        }

        // Handle search input
        const searchInputs = document.querySelectorAll('.search-input, .hero-search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleSearch(e.target.value));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        });

        // Handle search buttons
        const searchBtns = document.querySelectorAll('.search-btn, .hero-search-btn');
        searchBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const container = e.target.closest('.search-bar, .search-box');
                const input = container ? container.querySelector('input') : null;
                if (input) this.performSearch(input.value);
            });
        });
    }

    setupSearchData() {
        this.tools = [
            { name: 'PDF Compressor', category: 'File Tools', keywords: ['pdf', 'compress', 'reduce', 'size'] },
            { name: 'YouTube Thumbnail Downloader', category: 'Image Tools', keywords: ['youtube', 'thumbnail', 'download', 'image'] },
            { name: 'Image Compressor', category: 'Image Tools', keywords: ['image', 'compress', 'optimize', 'reduce'] },
            { name: 'Word Counter', category: 'Text Tools', keywords: ['word', 'count', 'text', 'characters'] },
            { name: 'JSON Formatter', category: 'Developer Tools', keywords: ['json', 'format', 'validate', 'pretty'] },
            { name: 'BMI Calculator', category: 'Utility Tools', keywords: ['bmi', 'calculator', 'health', 'weight'] },
            { name: 'Base64 Encoder', category: 'Developer Tools', keywords: ['base64', 'encode', 'decode'] },
            { name: 'Color Picker', category: 'Developer Tools', keywords: ['color', 'picker', 'hex', 'rgb'] },
            { name: 'QR Code Generator', category: 'Utility Tools', keywords: ['qr', 'code', 'generator', 'barcode'] },
            { name: 'Password Generator', category: 'Utility Tools', keywords: ['password', 'generator', 'secure', 'random'] }
        ];
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        if (!searchBox) return;
        searchBox.classList.add('active');
        const input = searchBox.querySelector('.search-input');
        if (input) setTimeout(() => input.focus(), 100);
        this.isOpen = true;
    }

    close() {
        if (!searchBox) return;
        searchBox.classList.remove('active');
        this.isOpen = false;
    }

    handleSearch(query) {
        if (query.length < 2) return;

        const results = this.tools.filter(tool => 
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.category.toLowerCase().includes(query.toLowerCase()) ||
            tool.keywords.some(keyword => keyword.includes(query.toLowerCase()))
        );

        // In a real application, you would show these results in a dropdown
        console.log('Search results:', results);
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        // In a real application, this would navigate to search results page
        console.log('Performing search for:', query);
        alert(`Searching for: "${query}"\n\nIn a real application, this would show search results.`);
    }
}

// Scroll Effects
class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.handleNavbarScroll();
        this.handleScrollAnimations();
    }

    handleNavbarScroll() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'var(--nav-bg)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'var(--nav-bg)';
            }

            // Hide/show navbar on scroll (optional)
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    handleScrollAnimations() {
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

        // Observe cards for animation
        const cards = document.querySelectorAll('.category-card, .tool-card, .feature-card, .blog-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }
}

// Smooth Scrolling for Anchor Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Dropdown Menu Handler
class DropdownManager {
    constructor() {
        this.init();
    }

    init() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            // Handle mobile dropdown clicks
            if (window.innerWidth <= 768) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                });
            }
        });

        // Handle window resize for dropdowns
        window.addEventListener('resize', () => {
            const dropdownMenus = document.querySelectorAll('.dropdown-menu');
            if (window.innerWidth > 768) {
                dropdownMenus.forEach(menu => {
                    menu.style.display = '';
                });
            }
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
}

// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.handleKeyboardNavigation();
        this.addAriaLabels();
        this.manageFocusTrapping();
    }

    handleKeyboardNavigation() {
        // Handle Escape key to close modals/menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu
                if (navMenu.classList.contains('active')) {
                    mobileNav.close();
                }
                // Close search
                if (searchBox && searchBox.classList.contains('active')) {
                    searchManager.close();
                }
            }
        });

        // Handle Tab navigation for dropdowns
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle.click();
                }
            });
        });
    }

    addAriaLabels() {
        // Add aria-labels for better screen reader support
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        if (themeToggle) themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
        if (searchToggle) searchToggle.setAttribute('aria-label', 'Open search');
        
        // Add aria-expanded for dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            dropdown.setAttribute('aria-expanded', 'false');
            dropdown.setAttribute('aria-haspopup', 'true');
        });
    }

    manageFocusTrapping() {
        // Trap focus within mobile menu when open
        const focusableElements = navMenu.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );

        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    const themeManager = new ThemeManager();
    const mobileNav = new MobileNav();
    const searchManager = new SearchManager();
    const scrollEffects = new ScrollEffects();
    const smoothScroll = new SmoothScroll();
    const dropdownManager = new DropdownManager();
    const performanceOptimizer = new PerformanceOptimizer();
    const accessibilityManager = new AccessibilityManager();

    // Initialize blog-specific managers
    const shareManager = new ShareManager();
    const sidebarManager = new SidebarManager();

    // FAQ Accordion Initialization
    function initAccordions() {
        const accordions = document.querySelectorAll('.faq-accordion');
        if (!accordions.length) return;

        accordions.forEach(acc => {
            const single = acc.getAttribute('data-accordion') === 'single';
            const items = acc.querySelectorAll('.faq-item');

            items.forEach(item => {
                const btn = item.querySelector('.faq-question');
                const wrapper = item.querySelector('.faq-answer-wrapper');
                if (!btn || !wrapper) return;

                // Ensure collapsed by default
                btn.setAttribute('aria-expanded', 'false');
                item.classList.remove('expanded');
                wrapper.style.height = '0px';

                const closeItem = (it) => {
                    const b = it.querySelector('.faq-question');
                    const w = it.querySelector('.faq-answer-wrapper');
                    if (!b || !w) return;
                    // If currently auto, compute height before collapsing
                    if (w.style.height === '' || w.style.height === 'auto') {
                        w.style.height = w.scrollHeight + 'px';
                        // Force reflow
                        void w.offsetHeight;
                    }
                    w.style.height = '0px';
                    b.setAttribute('aria-expanded', 'false');
                    it.classList.remove('expanded');
                };

                const openItem = (it) => {
                    const b = it.querySelector('.faq-question');
                    const w = it.querySelector('.faq-answer-wrapper');
                    if (!b || !w) return;
                    // Set to explicit height for transition, then to auto after transition
                    w.style.height = w.scrollHeight + 'px';
                    const onEnd = (e) => {
                        if (e.propertyName !== 'height') return;
                        w.style.height = 'auto';
                        w.removeEventListener('transitionend', onEnd);
                    };
                    w.addEventListener('transitionend', onEnd);
                    b.setAttribute('aria-expanded', 'true');
                    it.classList.add('expanded');
                };

                btn.addEventListener('click', () => {
                    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                    if (isExpanded) {
                        closeItem(item);
                    } else {
                        if (single) {
                            items.forEach(other => { if (other !== item) closeItem(other); });
                        }
                        openItem(item);
                    }
                });

                // Keyboard support: Enter/Space toggles
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });
            });
        });
    }

    initAccordions();

    // Bind theme toggle event (guarded)
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeManager.toggleTheme();
        });
    }

    // Smooth scroll to hero/top when clicking footer logo
    const footerLogo = document.querySelector('.footer .footer-logo');
    if (footerLogo) {
        footerLogo.addEventListener('click', (e) => {
            e.preventDefault();
            const hero = document.querySelector('.hero, .blog-hero, .sub-hero');
            const top = hero ? Math.max(hero.offsetTop - 80, 0) : 0; // offset for fixed navbar
            window.scrollTo({ top, behavior: 'smooth' });
        });
    }

    // Smooth scroll to top when clicking navbar logo
    const navLogo = document.querySelector('.nav-logo .logo');
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Add loading animation completion
    document.body.classList.add('loaded');

    // Handle form submissions (if any)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission here
            console.log('Form submitted');
        });
    });

    // Add click tracking for analytics (placeholder)
    const trackableElements = document.querySelectorAll('.btn, .category-card, .tool-card, .nav-link');
    trackableElements.forEach(element => {
        element.addEventListener('click', (e) => {
            // In a real application, you would send this data to your analytics service
            console.log('Element clicked:', {
                element: e.target.tagName,
                text: e.target.textContent?.trim(),
                href: e.target.href || null,
                timestamp: new Date().toISOString()
            });
        });
    });

    // Service Worker registration (for PWA capabilities)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Handle online/offline status
    window.addEventListener('online', () => {
        console.log('Back online');
        // Show notification or update UI
    });

    window.addEventListener('offline', () => {
        console.log('Gone offline');
        // Show offline notification
    });

    // Initialize tooltips (if needed)
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            // Create custom tooltip if needed
        });
    });

    console.log('ZetRocks website initialized successfully!');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        MobileNav,
        SearchManager,
        ScrollEffects,
        SmoothScroll,
        DropdownManager,
        PerformanceOptimizer,
        AccessibilityManager,
        ShareManager,
        SidebarManager
    };
}
