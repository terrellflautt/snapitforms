/**
 * Template Expansion Integration for SnapitForms
 * Adds 100+ professional templates to compete with JotForm's library
 */

class TemplateExpansionManager {
    constructor() {
        this.expandedTemplates = {};
        this.templateSearchIndex = {};
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        // Wait for ExpandedTemplates to be loaded
        if (typeof ExpandedTemplates === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        this.expandedTemplates = ExpandedTemplates;
        this.buildSearchIndex();
        this.enhanceTemplateSystem();
        this.addTemplateSearchAndFilter();

        console.log('✅ Template Expansion: 100+ professional templates loaded');
    }

    enhanceTemplateSystem() {
        // Enhance the existing template system in form generator
        if (window.formGenerator && window.formGenerator.templates) {
            // Merge expanded templates with existing ones
            Object.keys(this.expandedTemplates).forEach(categoryKey => {
                const category = this.expandedTemplates[categoryKey];
                if (category.templates) {
                    Object.assign(window.formGenerator.templates, category.templates);
                }
            });

            // Override template rendering for better UX
            this.enhanceTemplateRendering();
        }
    }

    enhanceTemplateRendering() {
        // Create enhanced template gallery
        const templatesContainer = document.querySelector('.templates-container');
        if (!templatesContainer) return;

        // Add template search and filter controls
        const controlsHTML = `
            <div class="template-controls" style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px;">
                        <input type="text" id="templateSearch" placeholder="🔍 Search templates..."
                               style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 16px;">
                    </div>
                    <div>
                        <select id="categoryFilter" style="padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 16px; background: white;">
                            <option value="all">All Categories</option>
                            <option value="business">💼 Business & Professional</option>
                            <option value="healthcare">🏥 Healthcare & Medical</option>
                            <option value="education">🎓 Education & Academic</option>
                            <option value="realEstate">🏠 Real Estate & Property</option>
                            <option value="foodService">🍽️ Food & Restaurant</option>
                            <option value="events">🎉 Events & Entertainment</option>
                            <option value="technology">💻 Technology & IT</option>
                            <option value="legal">⚖️ Legal & Compliance</option>
                            <option value="nonprofit">🤲 Non-Profit & Charity</option>
                        </select>
                    </div>
                    <div>
                        <button id="clearFilters" style="padding: 12px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                            Clear Filters
                        </button>
                    </div>
                </div>
                <div style="margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
                    <span class="filter-tag" data-filter="popular" style="padding: 6px 12px; background: #fbbf24; color: white; border-radius: 20px; cursor: pointer; font-size: 14px;">🔥 Popular</span>
                    <span class="filter-tag" data-filter="new" style="padding: 6px 12px; background: #10b981; color: white; border-radius: 20px; cursor: pointer; font-size: 14px;">✨ New</span>
                    <span class="filter-tag" data-filter="business" style="padding: 6px 12px; background: #6366f1; color: white; border-radius: 20px; cursor: pointer; font-size: 14px;">💼 Business</span>
                    <span class="filter-tag" data-filter="free" style="padding: 6px 12px; background: #059669; color: white; border-radius: 20px; cursor: pointer; font-size: 14px;">🆓 Free</span>
                </div>
            </div>
        `;

        templatesContainer.insertAdjacentHTML('afterbegin', controlsHTML);

        // Enhanced template grid
        this.renderTemplateGrid();
        this.setupTemplateControls();
    }

    renderTemplateGrid() {
        const templatesGrid = document.querySelector('.templates-grid') ||
                             document.createElement('div');
        templatesGrid.className = 'templates-grid enhanced-template-grid';
        templatesGrid.innerHTML = '';

        // Get filtered templates
        const filteredTemplates = this.getFilteredTemplates();

        // Template count indicator
        const countIndicator = document.createElement('div');
        countIndicator.innerHTML = `
            <div style="margin-bottom: 24px; text-align: center; color: #6b7280;">
                <span style="font-size: 18px; font-weight: 600;">${filteredTemplates.length}</span> templates found
                ${this.currentCategory !== 'all' ? `in ${this.getCategoryName(this.currentCategory)}` : ''}
                ${this.searchQuery ? `matching "${this.searchQuery}"` : ''}
            </div>
        `;
        templatesGrid.appendChild(countIndicator);

        // Render template cards
        filteredTemplates.forEach(template => {
            const templateCard = this.createTemplateCard(template);
            templatesGrid.appendChild(templateCard);
        });

        // Insert or replace in DOM
        const existingGrid = document.querySelector('.templates-grid');
        if (existingGrid) {
            existingGrid.parentNode.replaceChild(templatesGrid, existingGrid);
        } else {
            const templatesContainer = document.querySelector('.templates-container');
            templatesContainer.appendChild(templatesGrid);
        }

        // Add styles
        this.addTemplateGridStyles();
    }

    createTemplateCard(template) {
        const card = document.createElement('div');
        card.className = 'template-card enhanced-template-card';
        card.dataset.templateId = template.id;

        const badges = [];
        if (template.popular) badges.push('<span class="template-badge popular">🔥 Popular</span>');
        if (template.new) badges.push('<span class="template-badge new">✨ New</span>');
        if (template.pro) badges.push('<span class="template-badge pro">⭐ Pro</span>');

        card.innerHTML = `
            <div class="template-preview">
                <div class="template-icon">${template.icon}</div>
                <div class="template-badges">${badges.join('')}</div>
            </div>
            <div class="template-content">
                <h3 class="template-title">${template.name}</h3>
                <p class="template-description">${template.description}</p>
                <div class="template-meta">
                    <span class="template-category">${this.getCategoryName(template.category)}</span>
                    <span class="template-fields">${template.fields ? template.fields.length : 0} fields</span>
                </div>
                <div class="template-actions">
                    <button class="template-btn primary" onclick="templateExpansion.useTemplate('${template.id}')">
                        Use Template
                    </button>
                    <button class="template-btn secondary" onclick="templateExpansion.previewTemplate('${template.id}')">
                        Preview
                    </button>
                </div>
            </div>
        `;

        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });

        return card;
    }

    addTemplateGridStyles() {
        if (document.querySelector('#templateGridStyles')) return;

        const style = document.createElement('style');
        style.id = 'templateGridStyles';
        style.textContent = `
            .enhanced-template-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 24px;
                padding: 20px 0;
            }

            .enhanced-template-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid #e2e8f0;
            }

            .template-preview {
                position: relative;
                padding: 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                text-align: center;
                color: white;
            }

            .template-icon {
                font-size: 48px;
                margin-bottom: 8px;
            }

            .template-badges {
                position: absolute;
                top: 8px;
                right: 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .template-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                white-space: nowrap;
            }

            .template-badge.popular {
                background: rgba(251, 191, 36, 0.9);
            }

            .template-badge.new {
                background: rgba(16, 185, 129, 0.9);
            }

            .template-badge.pro {
                background: rgba(99, 102, 241, 0.9);
            }

            .template-content {
                padding: 20px;
            }

            .template-title {
                margin: 0 0 8px 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .template-description {
                margin: 0 0 16px 0;
                color: #6b7280;
                font-size: 14px;
                line-height: 1.5;
            }

            .template-meta {
                display: flex;
                justify-content: space-between;
                margin-bottom: 16px;
                font-size: 12px;
                color: #9ca3af;
            }

            .template-actions {
                display: flex;
                gap: 8px;
            }

            .template-btn {
                flex: 1;
                padding: 10px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .template-btn.primary {
                background: #6366f1;
                color: white;
            }

            .template-btn.primary:hover {
                background: #5855eb;
                transform: translateY(-1px);
            }

            .template-btn.secondary {
                background: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
            }

            .template-btn.secondary:hover {
                background: #e5e7eb;
            }

            .filter-tag {
                transition: all 0.2s ease;
            }

            .filter-tag:hover {
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }

            .filter-tag.active {
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
            }

            @media (max-width: 768px) {
                .enhanced-template-grid {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }

                .template-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupTemplateControls() {
        // Search functionality
        const searchInput = document.getElementById('templateSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderTemplateGrid();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.renderTemplateGrid();
            });
        }

        // Clear filters
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.currentCategory = 'all';
                this.searchQuery = '';
                if (searchInput) searchInput.value = '';
                if (categoryFilter) categoryFilter.value = 'all';
                document.querySelectorAll('.filter-tag.active').forEach(tag => {
                    tag.classList.remove('active');
                });
                this.renderTemplateGrid();
            });
        }

        // Filter tags
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const filter = tag.dataset.filter;

                // Toggle active state
                tag.classList.toggle('active');

                // Apply filter (this is a simplified implementation)
                if (filter === 'popular') {
                    this.currentCategory = filter;
                } else if (filter === 'new') {
                    this.currentCategory = filter;
                } else {
                    this.currentCategory = filter;
                }

                this.renderTemplateGrid();
            });
        });
    }

    getFilteredTemplates() {
        let allTemplates = [];

        // Collect all templates from all categories
        Object.keys(this.expandedTemplates).forEach(categoryKey => {
            const category = this.expandedTemplates[categoryKey];
            if (category.templates) {
                Object.keys(category.templates).forEach(templateKey => {
                    const template = {
                        ...category.templates[templateKey],
                        id: templateKey,
                        categoryKey: categoryKey
                    };
                    allTemplates.push(template);
                });
            }
        });

        // Apply filters
        let filtered = allTemplates;

        // Category filter
        if (this.currentCategory !== 'all') {
            if (this.currentCategory === 'popular') {
                filtered = filtered.filter(t => t.popular);
            } else if (this.currentCategory === 'new') {
                filtered = filtered.filter(t => t.new);
            } else {
                filtered = filtered.filter(t => t.category === this.currentCategory);
            }
        }

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(template =>
                template.name.toLowerCase().includes(this.searchQuery) ||
                template.description.toLowerCase().includes(this.searchQuery) ||
                template.category.toLowerCase().includes(this.searchQuery)
            );
        }

        return filtered;
    }

    getCategoryName(categoryKey) {
        const categoryNames = {
            business: 'Business & Professional',
            healthcare: 'Healthcare & Medical',
            education: 'Education & Academic',
            realEstate: 'Real Estate & Property',
            foodService: 'Food & Restaurant',
            events: 'Events & Entertainment',
            technology: 'Technology & IT',
            legal: 'Legal & Compliance',
            nonprofit: 'Non-Profit & Charity'
        };
        return categoryNames[categoryKey] || categoryKey;
    }

    buildSearchIndex() {
        // Build search index for fast searching
        this.templateSearchIndex = {};

        Object.keys(this.expandedTemplates).forEach(categoryKey => {
            const category = this.expandedTemplates[categoryKey];
            if (category.templates) {
                Object.keys(category.templates).forEach(templateKey => {
                    const template = category.templates[templateKey];
                    const searchText = `${template.name} ${template.description} ${template.category}`.toLowerCase();
                    this.templateSearchIndex[templateKey] = searchText;
                });
            }
        });
    }

    useTemplate(templateId) {
        // Find the template
        let templateData = null;

        Object.keys(this.expandedTemplates).forEach(categoryKey => {
            const category = this.expandedTemplates[categoryKey];
            if (category.templates && category.templates[templateId]) {
                templateData = category.templates[templateId];
            }
        });

        if (templateData && window.formGenerator) {
            // Load template into form generator
            window.formGenerator.loadTemplate(templateId);

            // Show success notification
            this.showNotification(`✅ Template "${templateData.name}" loaded successfully!`, 'success');

            // Navigate to form builder
            if (typeof window.location !== 'undefined') {
                window.location.href = '/form-generator.html?template=' + templateId;
            }
        }
    }

    previewTemplate(templateId) {
        // Find the template
        let templateData = null;

        Object.keys(this.expandedTemplates).forEach(categoryKey => {
            const category = this.expandedTemplates[categoryKey];
            if (category.templates && category.templates[templateId]) {
                templateData = category.templates[templateId];
            }
        });

        if (templateData) {
            this.showTemplatePreview(templateData);
        }
    }

    showTemplatePreview(template) {
        const modal = document.createElement('div');
        modal.className = 'template-preview-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentNode.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${template.name}</h2>
                    <button onclick="this.closest('.template-preview-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: #6b7280; margin-bottom: 20px;">${template.description}</p>
                    <div class="template-fields-preview">
                        <h3>Form Fields:</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${template.fields ? template.fields.map(field =>
                                `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                    <strong>${field.label}</strong> (${field.type})
                                    ${field.required ? '<span style="color: #ef4444;">*</span>' : ''}
                                </li>`
                            ).join('') : 'No fields defined'}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="this.closest('.template-preview-modal').remove()" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 6px; margin-right: 10px; cursor: pointer;">Close</button>
                    <button onclick="templateExpansion.useTemplate('${template.id || 'unknown'}')" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">Use This Template</button>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .template-preview-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
            }

            .modal-content {
                position: relative;
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
            }

            .modal-body {
                padding: 20px;
            }

            .modal-footer {
                padding: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: right;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `template-notification ${type}`;
        notification.textContent = message;

        const style = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10001',
            animation: 'slideIn 0.3s ease'
        };

        if (type === 'success') {
            style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else {
            style.background = 'linear-gradient(135deg, #6366f1, #5855eb)';
        }

        Object.assign(notification.style, style);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize template expansion
document.addEventListener('DOMContentLoaded', () => {
    window.templateExpansion = new TemplateExpansionManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateExpansionManager;
}