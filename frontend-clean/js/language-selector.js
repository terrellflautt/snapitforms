// Language Selector Component for SnapIT Forms
// Provides a dropdown to switch between English and Spanish

class LanguageSelector {
    constructor(containerId = 'language-selector-container') {
        this.containerId = containerId;
        this.translator = window.translator;
        this.init();
    }

    init() {
        this.createSelector();
        this.bindEvents();

        // Subscribe to language changes to update selector
        if (this.translator) {
            this.translator.subscribe((newLang) => {
                this.updateSelector(newLang);
            });
        }
    }

    createSelector() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.warn(`Language selector container '${this.containerId}' not found`);
            return;
        }

        const selectorHTML = `
            <div class="language-selector">
                <div class="language-dropdown">
                    <button class="language-toggle" id="language-toggle" aria-label="Select Language">
                        <span class="language-icon">🌐</span>
                        <span class="language-text" id="current-language">English</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="language-menu" id="language-menu">
                        <div class="language-option ${this.translator?.getCurrentLanguage() === 'en' ? 'active' : ''}" data-lang="en">
                            <span class="flag">🇺🇸</span>
                            <span>English</span>
                        </div>
                        <div class="language-option ${this.translator?.getCurrentLanguage() === 'es' ? 'active' : ''}" data-lang="es">
                            <span class="flag">🇪🇸</span>
                            <span>Español</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = selectorHTML;
        this.updateSelector(this.translator?.getCurrentLanguage() || 'en');
    }

    bindEvents() {
        // Toggle dropdown
        const toggle = document.getElementById('language-toggle');
        const menu = document.getElementById('language-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });

            // Handle language selection
            menu.addEventListener('click', (e) => {
                const option = e.target.closest('.language-option');
                if (option) {
                    const selectedLang = option.dataset.lang;
                    this.selectLanguage(selectedLang);
                    menu.classList.remove('show');
                }
            });
        }
    }

    selectLanguage(lang) {
        if (this.translator) {
            this.translator.setLanguage(lang);
            this.translator.translatePage();
            this.updateSelector(lang);

            // Show success message
            this.showLanguageChangeNotification(lang);
        }
    }

    updateSelector(lang) {
        const currentLanguageText = document.getElementById('current-language');
        const options = document.querySelectorAll('.language-option');

        if (currentLanguageText) {
            currentLanguageText.textContent = lang === 'en' ? 'English' : 'Español';
        }

        // Update active state
        options.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }

    showLanguageChangeNotification(lang) {
        const message = lang === 'en' ? 'Language changed to English' : 'Idioma cambiado a Español';

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'language-notification';
        notification.textContent = message;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to create language selector in navigation
    static createInNav() {
        const nav = document.querySelector('.navbar, .header, nav');
        if (nav) {
            const container = document.createElement('div');
            container.id = 'nav-language-selector';
            container.className = 'nav-language-selector';
            nav.appendChild(container);

            return new LanguageSelector('nav-language-selector');
        }
        return null;
    }

    // Method to create language selector in footer
    static createInFooter() {
        const footer = document.querySelector('.footer, footer');
        if (footer) {
            const container = document.createElement('div');
            container.id = 'footer-language-selector';
            container.className = 'footer-language-selector';
            footer.appendChild(container);

            return new LanguageSelector('footer-language-selector');
        }
        return null;
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    // Try to find existing language selector container
    if (document.getElementById('language-selector-container')) {
        new LanguageSelector();
    }

    // Auto-create in navigation if no existing container
    else if (document.querySelector('.navbar, .header, nav')) {
        LanguageSelector.createInNav();
    }
});

// Export for use in other scripts
window.LanguageSelector = LanguageSelector;