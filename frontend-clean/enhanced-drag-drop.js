/**
 * Enhanced Drag and Drop System for SnapitForms
 * Superior UX compared to JotForm and competitors
 */

class EnhancedDragDrop {
    constructor() {
        this.isDragging = false;
        this.draggedElement = null;
        this.dropZones = [];
        this.ghostElement = null;
        this.touchStarted = false;
        this.touchOffset = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.setupDragDropZones();
        this.setupTouchHandlers();
        this.setupVisualFeedback();
        this.setupAutoScroll();
    }

    setupDragDropZones() {
        // Enhanced field palette drag
        document.querySelectorAll('.field-button').forEach(button => {
            button.draggable = true;
            button.addEventListener('dragstart', (e) => this.handleDragStart(e));
            button.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        });

        // Enhanced form canvas drop
        const canvas = document.getElementById('formCanvas');
        if (canvas) {
            canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
            canvas.addEventListener('drop', (e) => this.handleDrop(e));
            canvas.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            canvas.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        }

        // Enhanced field reordering
        this.setupFieldReordering();
    }

    setupTouchHandlers() {
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    setupVisualFeedback() {
        // Create drop zone indicators
        const style = document.createElement('style');
        style.textContent = `
            .drag-active {
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05)) !important;
                border: 2px dashed #6366f1 !important;
                transform: scale(1.02);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
            }

            .field-button.dragging {
                opacity: 0.7;
                transform: scale(1.05) rotate(2deg);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                transition: transform 0.2s ease;
            }

            .drop-zone-active {
                background: rgba(34, 197, 94, 0.1);
                border-color: #22c55e !important;
                animation: pulseGreen 1.5s ease-in-out infinite;
            }

            .drop-zone-invalid {
                background: rgba(239, 68, 68, 0.1);
                border-color: #ef4444 !important;
                animation: pulseRed 1s ease-in-out infinite;
            }

            @keyframes pulseGreen {
                0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
            }

            @keyframes pulseRed {
                0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
            }

            .ghost-element {
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                opacity: 0.8;
                transform: rotate(5deg);
                transition: transform 0.1s ease;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .insertion-indicator {
                height: 3px;
                background: linear-gradient(90deg, #6366f1, #8b5cf6);
                border-radius: 2px;
                margin: 8px 0;
                animation: slideIn 0.2s ease;
                box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
            }

            @keyframes slideIn {
                from { width: 0; opacity: 0; }
                to { width: 100%; opacity: 1; }
            }

            .field-hover-preview {
                border: 2px solid #6366f1;
                background: rgba(99, 102, 241, 0.05);
                border-radius: 8px;
                animation: fadeIn 0.2s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    setupAutoScroll() {
        // Auto-scroll when dragging near edges
        let autoScrollInterval;

        document.addEventListener('dragover', (e) => {
            clearInterval(autoScrollInterval);

            const threshold = 100;
            const scrollSpeed = 20;
            const scrollContainer = document.querySelector('.form-builder-container') || window;

            if (e.clientY < threshold) {
                autoScrollInterval = setInterval(() => {
                    scrollContainer.scrollTop -= scrollSpeed;
                }, 16);
            } else if (window.innerHeight - e.clientY < threshold) {
                autoScrollInterval = setInterval(() => {
                    scrollContainer.scrollTop += scrollSpeed;
                }, 16);
            }
        });

        document.addEventListener('drop', () => clearInterval(autoScrollInterval));
        document.addEventListener('dragend', () => clearInterval(autoScrollInterval));
    }

    handleDragStart(e) {
        this.isDragging = true;
        this.draggedElement = e.target;

        // Add visual feedback
        e.target.classList.add('dragging');

        // Set drag data
        e.dataTransfer.setData('text/plain', e.target.dataset.fieldType);
        e.dataTransfer.effectAllowed = 'copy';

        // Create custom drag image
        this.createDragImage(e);

        // Add global drag state
        document.body.classList.add('dragging-active');
    }

    createDragImage(e) {
        const dragImage = e.target.cloneNode(true);
        dragImage.style.cssText = `
            position: absolute;
            top: -1000px;
            left: -1000px;
            background: white;
            border: 2px solid #6366f1;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: rotate(2deg);
        `;
        document.body.appendChild(dragImage);

        e.dataTransfer.setDragImage(dragImage, 20, 20);

        setTimeout(() => document.body.removeChild(dragImage), 0);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        // Show insertion indicator
        this.showInsertionIndicator(e);
    }

    showInsertionIndicator(e) {
        const canvas = document.getElementById('formCanvas');
        const fields = canvas.querySelectorAll('.form-field');

        // Remove existing indicators
        document.querySelectorAll('.insertion-indicator').forEach(el => el.remove());

        // Find insertion point
        let insertBefore = null;
        fields.forEach(field => {
            const rect = field.getBoundingClientRect();
            if (e.clientY < rect.top + rect.height / 2) {
                insertBefore = field;
                return;
            }
        });

        // Create indicator
        const indicator = document.createElement('div');
        indicator.className = 'insertion-indicator';

        if (insertBefore) {
            canvas.insertBefore(indicator, insertBefore);
        } else {
            canvas.appendChild(indicator);
        }
    }

    handleDragEnter(e) {
        e.preventDefault();
        const canvas = document.getElementById('formCanvas');
        canvas.classList.add('drop-zone-active');
    }

    handleDragLeave(e) {
        // Only remove if leaving the canvas entirely
        if (!e.currentTarget.contains(e.relatedTarget)) {
            const canvas = document.getElementById('formCanvas');
            canvas.classList.remove('drop-zone-active');
            document.querySelectorAll('.insertion-indicator').forEach(el => el.remove());
        }
    }

    handleDrop(e) {
        e.preventDefault();

        const fieldType = e.dataTransfer.getData('text/plain');

        // Add field with animation
        if (fieldType && window.formGenerator) {
            window.formGenerator.addField(fieldType);
            this.animateFieldAddition();
        }

        this.cleanup();
    }

    animateFieldAddition() {
        setTimeout(() => {
            const newField = document.querySelector('.form-field:last-of-type');
            if (newField) {
                newField.style.cssText = `
                    animation: fieldAppear 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-origin: center;
                `;

                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fieldAppear {
                        0% {
                            opacity: 0;
                            transform: scale(0.8) translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }, 50);
    }

    // Touch handlers for mobile optimization
    handleTouchStart(e) {
        this.touchStarted = true;
        this.draggedElement = e.target;

        const touch = e.touches[0];
        this.touchOffset = {
            x: touch.clientX - e.target.getBoundingClientRect().left,
            y: touch.clientY - e.target.getBoundingClientRect().top
        };

        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Create ghost element for touch
        this.createTouchGhost(e.target, touch);

        // Prevent default to allow custom touch handling
        e.preventDefault();
    }

    createTouchGhost(element, touch) {
        this.ghostElement = element.cloneNode(true);
        this.ghostElement.className += ' ghost-element';
        this.ghostElement.style.cssText = `
            position: fixed;
            left: ${touch.clientX - this.touchOffset.x}px;
            top: ${touch.clientY - this.touchOffset.y}px;
            pointer-events: none;
            z-index: 10000;
            opacity: 0.8;
            transform: scale(1.1) rotate(3deg);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(this.ghostElement);

        // Hide original
        element.style.opacity = '0.3';
    }

    handleTouchMove(e) {
        if (!this.touchStarted || !this.ghostElement) return;

        e.preventDefault();
        const touch = e.touches[0];

        // Update ghost position
        this.ghostElement.style.left = `${touch.clientX - this.touchOffset.x}px`;
        this.ghostElement.style.top = `${touch.clientY - this.touchOffset.y}px`;

        // Check for drop zone
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const canvas = document.getElementById('formCanvas');

        if (canvas && canvas.contains(elementBelow)) {
            canvas.classList.add('drop-zone-active');
            this.showInsertionIndicator({ clientY: touch.clientY });
        } else {
            canvas.classList.remove('drop-zone-active');
            document.querySelectorAll('.insertion-indicator').forEach(el => el.remove());
        }
    }

    handleTouchEnd(e) {
        if (!this.touchStarted) return;

        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const canvas = document.getElementById('formCanvas');

        // Check if dropped on canvas
        if (canvas && canvas.contains(elementBelow)) {
            const fieldType = this.draggedElement.dataset.fieldType;
            if (fieldType && window.formGenerator) {
                window.formGenerator.addField(fieldType);
                this.animateFieldAddition();

                // Success haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate([50, 100, 50]);
                }
            }
        }

        this.cleanup();
    }

    setupFieldReordering() {
        // Enhanced field reordering with better visual feedback
        const observer = new MutationObserver(() => {
            document.querySelectorAll('.form-field').forEach(field => {
                if (!field.hasAttribute('data-reorder-setup')) {
                    this.setupFieldDragReorder(field);
                    field.setAttribute('data-reorder-setup', 'true');
                }
            });
        });

        observer.observe(document.getElementById('formCanvas'), {
            childList: true,
            subtree: true
        });
    }

    setupFieldDragReorder(field) {
        field.draggable = true;

        field.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/field-id', field.dataset.fieldId);
            field.style.opacity = '0.5';
        });

        field.addEventListener('dragend', () => {
            field.style.opacity = '';
            document.querySelectorAll('.insertion-indicator').forEach(el => el.remove());
        });

        field.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggedFieldId = e.dataTransfer.getData('text/field-id');
            if (draggedFieldId && draggedFieldId !== field.dataset.fieldId) {
                this.showFieldInsertionIndicator(field, e);
            }
        });

        field.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedFieldId = e.dataTransfer.getData('text/field-id');
            if (draggedFieldId && draggedFieldId !== field.dataset.fieldId) {
                this.reorderFields(draggedFieldId, field.dataset.fieldId, e);
            }
        });
    }

    showFieldInsertionIndicator(targetField, e) {
        const rect = targetField.getBoundingClientRect();
        const isAbove = e.clientY < rect.top + rect.height / 2;

        document.querySelectorAll('.insertion-indicator').forEach(el => el.remove());

        const indicator = document.createElement('div');
        indicator.className = 'insertion-indicator';

        if (isAbove) {
            targetField.parentNode.insertBefore(indicator, targetField);
        } else {
            targetField.parentNode.insertBefore(indicator, targetField.nextSibling);
        }
    }

    reorderFields(draggedId, targetId, e) {
        if (window.formGenerator) {
            const rect = document.querySelector(`[data-field-id="${targetId}"]`).getBoundingClientRect();
            const isAbove = e.clientY < rect.top + rect.height / 2;

            // Call the form generator's reorder method
            window.formGenerator.reorderField(draggedId, targetId, isAbove ? 'before' : 'after');
        }
    }

    cleanup() {
        this.isDragging = false;
        this.touchStarted = false;

        // Remove visual states
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('.drop-zone-active').forEach(el => el.classList.remove('drop-zone-active'));
        document.querySelectorAll('.insertion-indicator').forEach(el => el.remove());
        document.body.classList.remove('dragging-active');

        // Restore opacity
        if (this.draggedElement) {
            this.draggedElement.style.opacity = '';
        }

        // Remove ghost element
        if (this.ghostElement) {
            document.body.removeChild(this.ghostElement);
            this.ghostElement = null;
        }

        this.draggedElement = null;
    }
}

// Initialize enhanced drag and drop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedDragDrop = new EnhancedDragDrop();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedDragDrop;
}