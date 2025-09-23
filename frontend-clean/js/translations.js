// SnapIT Forms Internationalization System
// Comprehensive translations for English and Spanish

const TRANSLATIONS = {
    en: {
        // Navigation & Header
        'nav.home': 'Home',
        'nav.dashboard': 'Dashboard',
        'nav.forms': 'Forms',
        'nav.templates': 'Templates',
        'nav.pricing': 'Pricing',
        'nav.support': 'Support',
        'nav.signin': 'Sign In',
        'nav.getStarted': 'Get Started',
        'nav.formGenerator': 'Form Generator',
        'nav.howItWorks': 'How It Works',
        'nav.devBlog': 'Dev Blog',

        // Homepage
        'hero.title': 'Build forms that work, without all the work',
        'hero.subtitle': 'SnapItForms handles your form submissions, email notifications, and data storage automatically. Just add your access key and you\'re done.',
        'hero.cta': 'Start Building Forms',
        'hero.freeTrial': 'Get started free • No credit card required',

        // Features
        'features.dragDrop': 'Drag & Drop Builder',
        'features.dragDropDesc': 'Intuitive visual form builder with real-time preview',
        'features.templates': '30+ Templates',
        'features.templatesDesc': 'Professional templates for every use case',
        'features.responsive': 'Mobile Responsive',
        'features.responsiveDesc': 'Perfect on all devices automatically',
        'features.analytics': 'Advanced Analytics',
        'features.analyticsDesc': 'Track performance and conversions',
        'features.integrations': 'Powerful Integrations',
        'features.integrationsDesc': 'Connect with your favorite tools',
        'features.security': 'Enterprise Security',
        'features.securityDesc': 'SOC 2 compliant with advanced encryption',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.welcome': 'Welcome back',
        'dashboard.totalForms': 'Total Forms',
        'dashboard.totalSubmissions': 'Total Submissions',
        'dashboard.thisMonth': 'This Month',
        'dashboard.conversionRate': 'Conversion Rate',
        'dashboard.createForm': 'Create New Form',
        'dashboard.recentForms': 'Recent Forms',
        'dashboard.recentSubmissions': 'Recent Submissions',
        'dashboard.viewAll': 'View All',
        'dashboard.upgrade': 'Upgrade Plan',
        'dashboard.currentPlan': 'Current Plan',
        'dashboard.usage': 'Usage',
        'dashboard.submissions': 'submissions',
        'dashboard.forms': 'forms',
        'dashboard.storage': 'storage',

        // Form Builder
        'builder.title': 'Form Builder',
        'builder.addField': 'Add Field',
        'builder.preview': 'Preview',
        'builder.settings': 'Settings',
        'builder.save': 'Save Form',
        'builder.publish': 'Publish',
        'builder.test': 'Test Form',
        'builder.export': 'Export Form',
        'builder.viewCode': 'View Code',
        'builder.fieldTypes': 'Field Types',
        'builder.textField': 'Text Field',
        'builder.email': 'Email',
        'builder.phone': 'Phone',
        'builder.textarea': 'Textarea',
        'builder.select': 'Dropdown',
        'builder.radio': 'Radio Buttons',
        'builder.checkbox': 'Checkboxes',
        'builder.file': 'File Upload',
        'builder.date': 'Date Picker',
        'builder.number': 'Number',
        'builder.rating': 'Rating',
        'builder.signature': 'Signature',
        'builder.elements': 'Elements',
        'builder.properties': 'Properties',
        'builder.formTitle': 'Form Title',
        'builder.fieldLabel': 'Field Label',
        'builder.placeholder': 'Placeholder Text',
        'builder.required': 'Required Field',
        'builder.optional': 'Optional Field',

        // Pricing
        'pricing.title': 'Simple, Transparent Pricing',
        'pricing.subtitle': 'Choose the perfect plan for your needs',
        'pricing.free': 'Free',
        'pricing.starter': 'Starter',
        'pricing.pro': 'Pro',
        'pricing.business': 'Business',
        'pricing.monthly': 'Monthly',
        'pricing.annually': 'Annually',
        'pricing.save': 'Save 20%',
        'pricing.mostPopular': 'Most Popular',
        'pricing.submissions': 'submissions/month',
        'pricing.forms': 'forms',
        'pricing.storage': 'storage',
        'pricing.support': 'support',
        'pricing.analytics': 'analytics',
        'pricing.integrations': 'integrations',
        'pricing.customization': 'customization',

        // Forms
        'form.required': 'Required',
        'form.optional': 'Optional',
        'form.submit': 'Submit',
        'form.submitting': 'Submitting...',
        'form.success': 'Thank you! Your form has been submitted.',
        'form.error': 'There was an error submitting your form. Please try again.',
        'form.validation.required': 'This field is required',
        'form.validation.email': 'Please enter a valid email address',
        'form.validation.phone': 'Please enter a valid phone number',
        'form.validation.url': 'Please enter a valid URL',
        'form.validation.number': 'Please enter a valid number',
        'form.validation.date': 'Please enter a valid date',

        // Footer
        'footer.product': 'Product',
        'footer.features': 'Features',
        'footer.pricing': 'Pricing',
        'footer.templates': 'Templates',
        'footer.integrations': 'Integrations',
        'footer.company': 'Company',
        'footer.about': 'About',
        'footer.blog': 'Blog',
        'footer.careers': 'Careers',
        'footer.contact': 'Contact',
        'footer.support': 'Support',
        'footer.docs': 'Documentation',
        'footer.api': 'API',
        'footer.status': 'System Status',
        'footer.legal': 'Legal',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.security': 'Security',
        'footer.copyright': '© 2025 SnapIT Software. All rights reserved.',

        // Language Selector
        'lang.select': 'Language',
        'lang.english': 'English',
        'lang.spanish': 'Español',

        // Success Messages
        'success.formCreated': 'Form created successfully!',
        'success.formUpdated': 'Form updated successfully!',
        'success.formDeleted': 'Form deleted successfully!',
        'success.settingsUpdated': 'Settings updated successfully!',

        // Error Messages
        'error.general': 'Something went wrong. Please try again.',
        'error.network': 'Network error. Please check your connection.',
        'error.unauthorized': 'You are not authorized to perform this action.',
        'error.notFound': 'The requested resource was not found.',
        'error.validation': 'Please check your input and try again.',

        // Loading States
        'loading.forms': 'Loading forms...',
        'loading.submissions': 'Loading submissions...',
        'loading.analytics': 'Loading analytics...',
        'loading.general': 'Loading...'
    },

    es: {
        // Navigation & Header
        'nav.home': 'Inicio',
        'nav.dashboard': 'Panel',
        'nav.forms': 'Formularios',
        'nav.templates': 'Plantillas',
        'nav.pricing': 'Precios',
        'nav.support': 'Soporte',
        'nav.signin': 'Iniciar Sesión',
        'nav.getStarted': 'Comenzar',
        'nav.formGenerator': 'Generador de Formularios',
        'nav.howItWorks': 'Cómo Funciona',
        'nav.devBlog': 'Blog de Desarrollo',

        // Homepage
        'hero.title': 'Crea formularios que funcionan, sin todo el trabajo',
        'hero.subtitle': 'SnapItForms maneja tus envíos de formularios, notificaciones por correo y almacenamiento de datos automáticamente. Solo agrega tu clave de acceso y listo.',
        'hero.cta': 'Comenzar a Crear Formularios',
        'hero.freeTrial': 'Comienza gratis • No se requiere tarjeta de crédito',

        // Features
        'features.dragDrop': 'Constructor Arrastrar y Soltar',
        'features.dragDropDesc': 'Constructor visual intuitivo con vista previa en tiempo real',
        'features.templates': '30+ Plantillas',
        'features.templatesDesc': 'Plantillas profesionales para cada caso de uso',
        'features.responsive': 'Responsivo Móvil',
        'features.responsiveDesc': 'Perfecto en todos los dispositivos automáticamente',
        'features.analytics': 'Análisis Avanzados',
        'features.analyticsDesc': 'Rastrea rendimiento y conversiones',
        'features.integrations': 'Integraciones Poderosas',
        'features.integrationsDesc': 'Conecta con tus herramientas favoritas',
        'features.security': 'Seguridad Empresarial',
        'features.securityDesc': 'Cumple con SOC 2 con cifrado avanzado',

        // Dashboard
        'dashboard.title': 'Panel de Control',
        'dashboard.welcome': 'Bienvenido de vuelta',
        'dashboard.totalForms': 'Formularios Totales',
        'dashboard.totalSubmissions': 'Envíos Totales',
        'dashboard.thisMonth': 'Este Mes',
        'dashboard.conversionRate': 'Tasa de Conversión',
        'dashboard.createForm': 'Crear Nuevo Formulario',
        'dashboard.recentForms': 'Formularios Recientes',
        'dashboard.recentSubmissions': 'Envíos Recientes',
        'dashboard.viewAll': 'Ver Todo',
        'dashboard.upgrade': 'Actualizar Plan',
        'dashboard.currentPlan': 'Plan Actual',
        'dashboard.usage': 'Uso',
        'dashboard.submissions': 'envíos',
        'dashboard.forms': 'formularios',
        'dashboard.storage': 'almacenamiento',

        // Form Builder
        'builder.title': 'Constructor de Formularios',
        'builder.addField': 'Agregar Campo',
        'builder.preview': 'Vista Previa',
        'builder.settings': 'Configuración',
        'builder.save': 'Guardar Formulario',
        'builder.publish': 'Publicar',
        'builder.test': 'Probar Formulario',
        'builder.export': 'Exportar Formulario',
        'builder.viewCode': 'Ver Código',
        'builder.fieldTypes': 'Tipos de Campo',
        'builder.textField': 'Campo de Texto',
        'builder.email': 'Correo Electrónico',
        'builder.phone': 'Teléfono',
        'builder.textarea': 'Área de Texto',
        'builder.select': 'Lista Desplegable',
        'builder.radio': 'Botones de Radio',
        'builder.checkbox': 'Casillas de Verificación',
        'builder.file': 'Subir Archivo',
        'builder.date': 'Selector de Fecha',
        'builder.number': 'Número',
        'builder.rating': 'Calificación',
        'builder.signature': 'Firma',
        'builder.elements': 'Elementos',
        'builder.properties': 'Propiedades',
        'builder.formTitle': 'Título del Formulario',
        'builder.fieldLabel': 'Etiqueta del Campo',
        'builder.placeholder': 'Texto de Ejemplo',
        'builder.required': 'Campo Requerido',
        'builder.optional': 'Campo Opcional',

        // Pricing
        'pricing.title': 'Precios Simples y Transparentes',
        'pricing.subtitle': 'Elige el plan perfecto para tus necesidades',
        'pricing.free': 'Gratis',
        'pricing.starter': 'Inicial',
        'pricing.pro': 'Pro',
        'pricing.business': 'Empresarial',
        'pricing.monthly': 'Mensual',
        'pricing.annually': 'Anual',
        'pricing.save': 'Ahorra 20%',
        'pricing.mostPopular': 'Más Popular',
        'pricing.submissions': 'envíos/mes',
        'pricing.forms': 'formularios',
        'pricing.storage': 'almacenamiento',
        'pricing.support': 'soporte',
        'pricing.analytics': 'análisis',
        'pricing.integrations': 'integraciones',
        'pricing.customization': 'personalización',

        // Forms
        'form.required': 'Requerido',
        'form.optional': 'Opcional',
        'form.submit': 'Enviar',
        'form.submitting': 'Enviando...',
        'form.success': '¡Gracias! Tu formulario ha sido enviado.',
        'form.error': 'Hubo un error al enviar tu formulario. Por favor intenta de nuevo.',
        'form.validation.required': 'Este campo es requerido',
        'form.validation.email': 'Por favor ingresa una dirección de correo válida',
        'form.validation.phone': 'Por favor ingresa un número de teléfono válido',
        'form.validation.url': 'Por favor ingresa una URL válida',
        'form.validation.number': 'Por favor ingresa un número válido',
        'form.validation.date': 'Por favor ingresa una fecha válida',

        // Footer
        'footer.product': 'Producto',
        'footer.features': 'Características',
        'footer.pricing': 'Precios',
        'footer.templates': 'Plantillas',
        'footer.integrations': 'Integraciones',
        'footer.company': 'Empresa',
        'footer.about': 'Acerca de',
        'footer.blog': 'Blog',
        'footer.careers': 'Carreras',
        'footer.contact': 'Contacto',
        'footer.support': 'Soporte',
        'footer.docs': 'Documentación',
        'footer.api': 'API',
        'footer.status': 'Estado del Sistema',
        'footer.legal': 'Legal',
        'footer.privacy': 'Política de Privacidad',
        'footer.terms': 'Términos de Servicio',
        'footer.security': 'Seguridad',
        'footer.copyright': '© 2025 SnapIT Software. Todos los derechos reservados.',

        // Language Selector
        'lang.select': 'Idioma',
        'lang.english': 'English',
        'lang.spanish': 'Español',

        // Success Messages
        'success.formCreated': '¡Formulario creado exitosamente!',
        'success.formUpdated': '¡Formulario actualizado exitosamente!',
        'success.formDeleted': '¡Formulario eliminado exitosamente!',
        'success.settingsUpdated': '¡Configuración actualizada exitosamente!',

        // Error Messages
        'error.general': 'Algo salió mal. Por favor intenta de nuevo.',
        'error.network': 'Error de red. Por favor verifica tu conexión.',
        'error.unauthorized': 'No estás autorizado para realizar esta acción.',
        'error.notFound': 'El recurso solicitado no fue encontrado.',
        'error.validation': 'Por favor verifica tu entrada e intenta de nuevo.',

        // Loading States
        'loading.forms': 'Cargando formularios...',
        'loading.submissions': 'Cargando envíos...',
        'loading.analytics': 'Cargando análisis...',
        'loading.general': 'Cargando...'
    }
};

// Translation utility class
class Translator {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.observers = [];
    }

    // Detect user's preferred language
    detectLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem('snapit-language');
        if (saved && TRANSLATIONS[saved]) {
            return saved;
        }

        // Check browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('es')) {
            return 'es';
        }

        // Default to English
        return 'en';
    }

    // Get translation for a key
    t(key, variables = {}) {
        const translation = TRANSLATIONS[this.currentLanguage]?.[key] ||
                          TRANSLATIONS['en']?.[key] ||
                          key;

        // Replace variables in translation
        return Object.keys(variables).reduce((str, variable) => {
            return str.replace(new RegExp(`{${variable}}`, 'g'), variables[variable]);
        }, translation);
    }

    // Set language
    setLanguage(lang) {
        if (TRANSLATIONS[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('snapit-language', lang);
            document.documentElement.lang = lang;
            this.notifyObservers();
        }
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Subscribe to language changes
    subscribe(callback) {
        this.observers.push(callback);
    }

    // Notify observers of language change
    notifyObservers() {
        this.observers.forEach(callback => callback(this.currentLanguage));
    }

    // Auto-translate elements with data-i18n attribute
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }
}

// Global translator instance
window.translator = new Translator();

// Auto-translate on page load
document.addEventListener('DOMContentLoaded', () => {
    window.translator.translatePage();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TRANSLATIONS, Translator };
}