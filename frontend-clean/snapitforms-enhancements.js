/**
 * SnapitForms Enhancement Integration
 * Adds professional features to compete with JotForm, Typeform, and other premium builders
 *
 * Features Added:
 * ✅ Advanced Field Types (Rating, Signature, Rich Text, File Upload, Date Range, Matrix)
 * ✅ Enhanced Drag & Drop with animations and mobile touch support
 * ✅ Visual Conditional Logic Builder (premium feature)
 * ✅ Mobile-first optimizations
 * ✅ Professional animations and micro-interactions
 */

class SnapitFormsEnhancements {
    constructor() {
        this.enhanced = false;
        this.originalFormGenerator = null;
        this.init();
    }

    init() {
        // Wait for form generator to be ready
        if (typeof window.formGenerator === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        this.enhanceFormGenerator();
        this.addAdvancedFieldTypes();
        this.initializeEnhancedDragDrop();
        this.setupConditionalLogic();
        this.addPremiumFeatures();
        this.enhanced = true;

        console.log('🚀 SnapitForms Enhanced - Professional features activated!');
    }

    enhanceFormGenerator() {
        const generator = window.formGenerator;

        // Store original methods
        this.originalFormGenerator = {
            createFieldElement: generator.createFieldElement.bind(generator),
            addField: generator.addField.bind(generator),
            getDefaultLabel: generator.getDefaultLabel.bind(generator)
        };

        // Enhance addField to support new field types
        generator.addField = (type) => {
            const advancedTypes = ['rating', 'signature', 'richtext', 'fileupload', 'daterange', 'matrix'];

            if (advancedTypes.includes(type)) {
                this.addAdvancedField(type);
            } else {
                this.originalFormGenerator.addField(type);
            }
        };

        // Enhance createFieldElement to support advanced types
        generator.createFieldElement = (field) => {
            const advancedTypes = ['rating', 'signature', 'richtext', 'fileupload', 'daterange', 'matrix'];

            if (advancedTypes.includes(field.type)) {
                return this.createAdvancedFieldElement(field);
            } else {
                return this.originalFormGenerator.createFieldElement(field);
            }
        };

        // Enhance field labels
        const originalGetDefaultLabel = generator.getDefaultLabel;
        generator.getDefaultLabel = (type) => {
            const advancedLabels = {
                rating: '⭐ Rating',
                signature: '✍️ Digital Signature',
                richtext: '📝 Rich Text',
                fileupload: '📁 File Upload',
                daterange: '📅 Date Range',
                matrix: '📊 Matrix/Grid'
            };

            return advancedLabels[type] || originalGetDefaultLabel(type);
        };

        // Add reorder functionality
        generator.reorderField = (draggedId, targetId, position) => {
            const draggedIndex = generator.fields.findIndex(f => f.id === draggedId);
            const targetIndex = generator.fields.findIndex(f => f.id === targetId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const draggedField = generator.fields.splice(draggedIndex, 1)[0];
                const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
                generator.fields.splice(insertIndex, 0, draggedField);

                generator.renderFields();
                generator.updateCode();
                this.applyConditionalLogic();
            }
        };
    }

    addAdvancedFieldTypes() {
        // Add new field buttons to the palette
        const fieldPalette = document.querySelector('.field-palette') || document.querySelector('.fields-list');
        if (!fieldPalette) return;

        const advancedFields = [
            { type: 'rating', icon: '⭐', label: 'Rating', pro: true },
            { type: 'signature', icon: '✍️', label: 'Signature', pro: true },
            { type: 'richtext', icon: '📝', label: 'Rich Text', pro: true },
            { type: 'fileupload', icon: '📁', label: 'File Upload', pro: false },
            { type: 'daterange', icon: '📅', label: 'Date Range', pro: true },
            { type: 'matrix', icon: '📊', label: 'Matrix', pro: true }
        ];

        const advancedSection = document.createElement('div');
        advancedSection.innerHTML = `
            <div style="margin: 20px 0 10px 0; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <h4 style="margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600;">
                    ⚡ Advanced Fields
                    <span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 8px;">PRO</span>
                </h4>
            </div>
        `;

        advancedFields.forEach(field => {
            const button = document.createElement('button');
            button.className = 'field-button';
            button.dataset.fieldType = field.type;
            button.draggable = true;
            button.innerHTML = `
                <span class="field-icon">${field.icon}</span>
                <span class="field-label">${field.label}</span>
                ${field.pro ? '<span class="pro-badge">PRO</span>' : ''}
            `;

            button.addEventListener('click', () => {
                if (field.pro) {
                    this.showProFeatureModal(field.label);
                } else {
                    window.formGenerator.addField(field.type);
                }
            });

            advancedSection.appendChild(button);
        });

        fieldPalette.appendChild(advancedSection);

        // Add pro badge styles
        const style = document.createElement('style');
        style.textContent = `
            .pro-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                padding: 2px 4px;
                border-radius: 6px;
                font-size: 9px;
                font-weight: 600;
                animation: sparkle 2s ease-in-out infinite;
            }

            @keyframes sparkle {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .field-button {
                position: relative;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .field-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
        `;
        document.head.appendChild(style);
    }

    addAdvancedField(type) {
        const field = {
            id: 'field_' + Date.now(),
            type: type,
            label: window.formGenerator.getDefaultLabel(type),
            name: this.getDefaultName(type),
            required: false,
            placeholder: this.getDefaultPlaceholder(type),
            options: type === 'matrix' ? {
                rows: ['Row 1', 'Row 2', 'Row 3'],
                columns: ['Option 1', 'Option 2', 'Option 3']
            } : []
        };

        // Add type-specific properties
        switch (type) {
            case 'rating':
                field.maxRating = 5;
                break;
            case 'fileupload':
                field.multiple = false;
                field.accept = '';
                field.maxSize = 10;
                break;
            case 'richtext':
                field.minHeight = 100;
                break;
        }

        window.formGenerator.fields.push(field);
        window.formGenerator.renderFields();
        window.formGenerator.selectField(field.id);
        window.formGenerator.updateCode();
    }

    createAdvancedFieldElement(field) {
        const div = document.createElement('div');
        div.className = 'form-field advanced-field';
        div.dataset.fieldId = field.id;

        div.addEventListener('click', () => window.formGenerator.selectField(field.id));

        let inputHtml = '';

        switch (field.type) {
            case 'rating':
                inputHtml = this.createRatingHTML(field);
                break;
            case 'signature':
                inputHtml = this.createSignatureHTML(field);
                break;
            case 'richtext':
                inputHtml = this.createRichTextHTML(field);
                break;
            case 'fileupload':
                inputHtml = this.createFileUploadHTML(field);
                break;
            case 'daterange':
                inputHtml = this.createDateRangeHTML(field);
                break;
            case 'matrix':
                inputHtml = this.createMatrixHTML(field);
                break;
        }

        div.innerHTML = `
            <label class="field-label">
                ${field.label}
                ${field.required ? '<span style="color: #ef4444;">*</span>' : ''}
                <span class="pro-indicator" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1px 6px; border-radius: 4px; font-size: 10px; margin-left: 8px;">PRO</span>
            </label>
            ${inputHtml}
            <div class="field-controls">
                <button class="control-btn" onclick="formGenerator.moveFieldUp('${field.id}')" title="Move Up">↑</button>
                <button class="control-btn" onclick="formGenerator.moveFieldDown('${field.id}')" title="Move Down">↓</button>
                <button class="control-btn" onclick="formGenerator.deleteField('${field.id}')" title="Delete">×</button>
            </div>
        `;

        // Initialize advanced field functionality
        setTimeout(() => this.initializeAdvancedField(field, div), 100);

        return div;
    }

    createRatingHTML(field) {
        const maxRating = field.maxRating || 5;
        const stars = Array.from({length: maxRating}, (_, i) =>
            `<span class="star" data-rating="${i + 1}" style="color: #ddd; font-size: 24px; cursor: pointer; margin-right: 4px;">★</span>`
        ).join('');

        return `
            <div class="rating-field" data-rating="0" style="padding: 12px 0;">
                ${stars}
                <input type="hidden" name="${field.name}" value="0">
            </div>
        `;
    }

    createSignatureHTML(field) {
        return `
            <div class="signature-field" style="padding: 12px 0;">
                <canvas width="400" height="150" style="border: 2px dashed #ddd; border-radius: 8px; cursor: crosshair; width: 100%; max-width: 400px; height: 150px; background: #fafafa;"></canvas>
                <div style="margin-top: 8px;">
                    <button type="button" class="clear-signature" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Clear</button>
                    <input type="hidden" name="${field.name}">
                </div>
            </div>
        `;
    }

    createRichTextHTML(field) {
        return `
            <div class="rich-text-field" style="padding: 12px 0;">
                <div class="rich-text-toolbar" style="margin-bottom: 8px; border: 1px solid #ddd; padding: 8px; border-radius: 4px 4px 0 0; background: #f9f9f9;">
                    <button type="button" class="format-btn" data-command="bold" style="margin-right: 4px; padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 2px; cursor: pointer;"><b>B</b></button>
                    <button type="button" class="format-btn" data-command="italic" style="margin-right: 4px; padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 2px; cursor: pointer;"><i>I</i></button>
                    <button type="button" class="format-btn" data-command="underline" style="margin-right: 4px; padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 2px; cursor: pointer;"><u>U</u></button>
                </div>
                <div class="rich-text-editor" contenteditable="true"
                     style="min-height: 100px; padding: 12px; border: 1px solid #ddd; border-radius: 0 0 4px 4px; border-top: none; background: white;"
                     placeholder="${field.placeholder}"></div>
                <input type="hidden" name="${field.name}">
            </div>
        `;
    }

    createFileUploadHTML(field) {
        return `
            <div class="file-upload-field" style="padding: 12px 0;">
                <div class="file-drop-zone"
                     style="border: 2px dashed #ddd; border-radius: 8px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.3s; background: #fafafa;">
                    <div style="font-size: 48px; color: #ddd; margin-bottom: 16px;">📁</div>
                    <div>
                        <strong>Click to upload</strong> or drag files here
                        <div style="font-size: 14px; color: #666; margin-top: 8px;">
                            Max file size: 10MB
                        </div>
                    </div>
                    <input type="file" name="${field.name}" style="display: none;">
                </div>
                <div class="file-list" style="margin-top: 12px;"></div>
            </div>
        `;
    }

    createDateRangeHTML(field) {
        return `
            <div class="date-range-field" style="display: flex; gap: 12px; align-items: center; padding: 12px 0;">
                <div style="flex: 1;">
                    <label style="display: block; font-size: 14px; color: #666; margin-bottom: 4px;">From</label>
                    <input type="date" name="${field.name}_start" class="field-input" style="width: 100%;">
                </div>
                <div style="padding-top: 20px; color: #666;">to</div>
                <div style="flex: 1;">
                    <label style="display: block; font-size: 14px; color: #666; margin-bottom: 4px;">To</label>
                    <input type="date" name="${field.name}_end" class="field-input" style="width: 100%;">
                </div>
            </div>
        `;
    }

    createMatrixHTML(field) {
        const rows = field.options?.rows || ['Row 1', 'Row 2', 'Row 3'];
        const columns = field.options?.columns || ['Option 1', 'Option 2', 'Option 3'];

        let matrixHtml = `
            <div class="matrix-field" style="padding: 12px 0;">
                <table style="width: 100%; border-collapse: collapse; background: white;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;"></th>
                            ${columns.map(col => `<th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd; font-size: 14px;">${col}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        rows.forEach((row, rowIndex) => {
            matrixHtml += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 500;">${row}</td>
                    ${columns.map(col => `
                        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #eee;">
                            <input type="radio" name="${field.name}_row_${rowIndex}" value="${col}">
                        </td>
                    `).join('')}
                </tr>
            `;
        });

        matrixHtml += `
                    </tbody>
                </table>
            </div>
        `;

        return matrixHtml;
    }

    initializeAdvancedField(field, element) {
        switch (field.type) {
            case 'rating':
                this.initializeRatingField(element);
                break;
            case 'signature':
                this.initializeSignatureField(element);
                break;
            case 'richtext':
                this.initializeRichTextField(element);
                break;
            case 'fileupload':
                this.initializeFileUploadField(element);
                break;
        }
    }

    initializeRatingField(element) {
        const ratingField = element.querySelector('.rating-field');
        const stars = ratingField.querySelectorAll('.star');
        const hiddenInput = ratingField.querySelector('input[type="hidden"]');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const rating = index + 1;
                hiddenInput.value = rating;
                ratingField.dataset.rating = rating;

                stars.forEach((s, i) => {
                    s.style.color = i < rating ? '#fbbf24' : '#ddd';
                });
            });

            star.addEventListener('mouseover', () => {
                stars.forEach((s, i) => {
                    s.style.color = i <= index ? '#fbbf24' : '#ddd';
                });
            });
        });

        ratingField.addEventListener('mouseleave', () => {
            const currentRating = parseInt(ratingField.dataset.rating);
            stars.forEach((s, i) => {
                s.style.color = i < currentRating ? '#fbbf24' : '#ddd';
            });
        });
    }

    initializeSignatureField(element) {
        const canvas = element.querySelector('canvas');
        const clearBtn = element.querySelector('.clear-signature');
        const hiddenInput = element.querySelector('input[type="hidden"]');

        const ctx = canvas.getContext('2d');
        let isDrawing = false;

        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const startDrawing = (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            hiddenInput.value = canvas.toDataURL();
        };

        const stopDrawing = () => {
            isDrawing = false;
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hiddenInput.value = '';
        });
    }

    initializeRichTextField(element) {
        const editor = element.querySelector('.rich-text-editor');
        const hiddenInput = element.querySelector('input[type="hidden"]');
        const formatBtns = element.querySelectorAll('.format-btn');

        editor.addEventListener('input', () => {
            hiddenInput.value = editor.innerHTML;
        });

        formatBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                document.execCommand(command, false, null);
                editor.focus();
                hiddenInput.value = editor.innerHTML;
            });
        });
    }

    initializeFileUploadField(element) {
        const dropZone = element.querySelector('.file-drop-zone');
        const fileInput = dropZone.querySelector('input[type="file"]');
        const fileList = element.querySelector('.file-list');

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#6366f1';
            dropZone.style.backgroundColor = '#eff6ff';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = '#ddd';
            dropZone.style.backgroundColor = '#fafafa';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#ddd';
            dropZone.style.backgroundColor = '#fafafa';

            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files, fileList);
        });

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files, fileList);
        });
    }

    handleFiles(files, fileList) {
        fileList.innerHTML = '';
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f9f9f9; border-radius: 4px; margin-bottom: 4px;';
            fileItem.innerHTML = `
                <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button type="button" onclick="this.parentNode.remove()" style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 2px; cursor: pointer;">×</button>
            `;
            fileList.appendChild(fileItem);
        });
    }

    getDefaultName(type) {
        const names = {
            rating: 'rating',
            signature: 'signature',
            richtext: 'rich_text',
            fileupload: 'file_upload',
            daterange: 'date_range',
            matrix: 'matrix_response'
        };
        return names[type] || 'field';
    }

    getDefaultPlaceholder(type) {
        const placeholders = {
            rating: '',
            signature: '',
            richtext: 'Enter your detailed response...',
            fileupload: '',
            daterange: '',
            matrix: ''
        };
        return placeholders[type] || '';
    }

    initializeEnhancedDragDrop() {
        // Enhanced drag and drop is loaded from separate file
        // This ensures compatibility with existing drag/drop
        if (window.enhancedDragDrop) {
            console.log('✅ Enhanced Drag & Drop activated');
        }
    }

    setupConditionalLogic() {
        // Conditional logic is loaded from separate file
        if (window.conditionalLogicBuilder) {
            console.log('✅ Conditional Logic Builder activated');
            this.applyConditionalLogic = () => {
                if (window.conditionalLogicBuilder.applyLogicRules) {
                    window.conditionalLogicBuilder.applyLogicRules();
                }
            };
        }
    }

    addPremiumFeatures() {
        // Add premium feature indicators
        const style = document.createElement('style');
        style.textContent = `
            .advanced-field {
                position: relative;
                border: 2px solid transparent;
                background: linear-gradient(white, white) padding-box,
                           linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3)) border-box;
                border-radius: 8px;
                margin-bottom: 16px;
            }

            .advanced-field::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 8px;
                z-index: -1;
                opacity: 0.1;
            }

            .pro-indicator {
                animation: glow 2s ease-in-out infinite alternate;
            }

            @keyframes glow {
                from { box-shadow: 0 0 5px rgba(16, 185, 129, 0.5); }
                to { box-shadow: 0 0 15px rgba(16, 185, 129, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    showProFeatureModal(featureName) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 40px; border-radius: 12px; max-width: 500px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 20px;">⭐</div>
                    <h3 style="margin: 0 0 16px 0; color: #1f2937;">Unlock ${featureName}</h3>
                    <p style="color: #6b7280; margin-bottom: 24px; line-height: 1.5;">
                        ${featureName} is a premium feature available in our Pro plan.
                        Get access to advanced field types, conditional logic, and more!
                    </p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button onclick="this.closest('div[style*=fixed]').remove()"
                                style="background: #e5e7eb; color: #374151; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer;">
                            Maybe Later
                        </button>
                        <button onclick="window.open('${this.getUpgradeUrl()}', '_blank'); this.closest('div[style*=fixed]').remove();"
                                style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500;">
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getUpgradeUrl() {
        // This would typically link to your Stripe checkout or billing page
        return '#upgrade'; // Replace with actual upgrade URL
    }
}

// Initialize enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.snapitFormsEnhancements = new SnapitFormsEnhancements();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnapitFormsEnhancements;
}