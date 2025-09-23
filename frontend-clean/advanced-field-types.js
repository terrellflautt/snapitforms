/**
 * Advanced Field Types for SnapitForms
 * Provides competitive field types that JotForm charges for
 */

const AdvancedFieldTypes = {
    // Rating/Star field (commonly charged for)
    createRatingField(field) {
        const maxRating = field.maxRating || 5;
        const ratingHtml = Array.from({length: maxRating}, (_, i) =>
            `<span class="star" data-rating="${i + 1}" style="color: #ddd; font-size: 24px; cursor: pointer; margin-right: 4px;">★</span>`
        ).join('');

        return `
            <div class="rating-field" data-rating="0">
                ${ratingHtml}
                <input type="hidden" name="${field.name}" value="0" ${field.required ? 'required' : ''}>
            </div>
            <script>
                (function() {
                    const ratingField = document.querySelector('[data-field-id="${field.id}"] .rating-field');
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
                })();
            </script>
        `;
    },

    // Digital Signature field (premium feature)
    createSignatureField(field) {
        return `
            <div class="signature-field">
                <canvas id="signature-${field.id}" width="400" height="150" style="border: 2px dashed #ddd; border-radius: 8px; cursor: crosshair; width: 100%; max-width: 400px; height: 150px;"></canvas>
                <div style="margin-top: 8px;">
                    <button type="button" onclick="clearSignature('${field.id}')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Clear</button>
                    <input type="hidden" name="${field.name}" ${field.required ? 'required' : ''}>
                </div>
            </div>
            <script>
                (function() {
                    const canvas = document.getElementById('signature-${field.id}');
                    const ctx = canvas.getContext('2d');
                    const hiddenInput = canvas.parentNode.querySelector('input[type="hidden"]');
                    let isDrawing = false;
                    let hasSignature = false;

                    // Set actual canvas size
                    const rect = canvas.getBoundingClientRect();
                    canvas.width = rect.width * window.devicePixelRatio;
                    canvas.height = rect.height * window.devicePixelRatio;
                    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                    canvas.style.width = rect.width + 'px';
                    canvas.style.height = rect.height + 'px';

                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';

                    // Mouse events
                    canvas.addEventListener('mousedown', startDrawing);
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('mouseup', stopDrawing);
                    canvas.addEventListener('mouseout', stopDrawing);

                    // Touch events for mobile
                    canvas.addEventListener('touchstart', handleTouch);
                    canvas.addEventListener('touchmove', handleTouch);
                    canvas.addEventListener('touchend', stopDrawing);

                    function startDrawing(e) {
                        isDrawing = true;
                        const rect = canvas.getBoundingClientRect();
                        ctx.beginPath();
                        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                    }

                    function draw(e) {
                        if (!isDrawing) return;
                        const rect = canvas.getBoundingClientRect();
                        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx.stroke();
                        hasSignature = true;
                        hiddenInput.value = canvas.toDataURL();
                    }

                    function stopDrawing() {
                        isDrawing = false;
                    }

                    function handleTouch(e) {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const rect = canvas.getBoundingClientRect();
                        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
                            clientX: touch.clientX,
                            clientY: touch.clientY
                        });
                        canvas.dispatchEvent(mouseEvent);
                    }

                    window.clearSignature = function(fieldId) {
                        if (fieldId === '${field.id}') {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            hiddenInput.value = '';
                            hasSignature = false;
                        }
                    };
                })();
            </script>
        `;
    },

    // Rich Text Editor field (advanced feature)
    createRichTextField(field) {
        return `
            <div class="rich-text-field">
                <div class="rich-text-toolbar" style="margin-bottom: 8px; border: 1px solid #ddd; padding: 8px; border-radius: 4px 4px 0 0; background: #f9f9f9;">
                    <button type="button" onclick="formatText('${field.id}', 'bold')" style="margin-right: 4px; padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 2px;"><b>B</b></button>
                    <button type="button" onclick="formatText('${field.id}', 'italic')" style="margin-right: 4px; padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 2px;"><i>I</i></button>
                    <button type="button" onclick="formatText('${field.id}', 'underline')" style="margin-right: 4px; padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 2px;"><u>U</u></button>
                    <button type="button" onclick="formatText('${field.id}', 'insertUnorderedList')" style="margin-right: 4px; padding: 4px 8px; border: 1px solid #ddd; background: white; border-radius: 2px;">• List</button>
                </div>
                <div id="richtext-${field.id}" contenteditable="true"
                     style="min-height: 100px; padding: 12px; border: 1px solid #ddd; border-radius: 0 0 4px 4px; border-top: none;"
                     placeholder="${field.placeholder}"></div>
                <input type="hidden" name="${field.name}" ${field.required ? 'required' : ''}>
            </div>
            <script>
                (function() {
                    const editor = document.getElementById('richtext-${field.id}');
                    const hiddenInput = editor.parentNode.querySelector('input[type="hidden"]');

                    editor.addEventListener('input', () => {
                        hiddenInput.value = editor.innerHTML;
                    });

                    // Placeholder handling
                    editor.addEventListener('focus', () => {
                        if (editor.innerHTML === '') {
                            editor.innerHTML = '';
                        }
                    });

                    editor.addEventListener('blur', () => {
                        if (editor.innerHTML === '' || editor.innerHTML === '<br>') {
                            editor.innerHTML = '';
                        }
                    });

                    window.formatText = function(fieldId, command) {
                        if (fieldId === '${field.id}') {
                            document.execCommand(command, false, null);
                            editor.focus();
                            hiddenInput.value = editor.innerHTML;
                        }
                    };
                })();
            </script>
        `;
    },

    // File Upload with Drag & Drop (enhanced)
    createFileUploadField(field) {
        const multiple = field.multiple ? 'multiple' : '';
        const accept = field.accept || '';

        return `
            <div class="file-upload-field">
                <div class="file-drop-zone"
                     style="border: 2px dashed #ddd; border-radius: 8px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.3s;"
                     onmouseover="this.style.borderColor='#6366f1'; this.style.backgroundColor='#f8fafc'"
                     onmouseout="this.style.borderColor='#ddd'; this.style.backgroundColor='transparent'">
                    <div class="upload-icon" style="font-size: 48px; color: #ddd; margin-bottom: 16px;">📁</div>
                    <div class="upload-text">
                        <strong>Click to upload</strong> or drag and drop files here
                        <div style="font-size: 14px; color: #666; margin-top: 8px;">
                            ${field.maxSize ? `Max file size: ${field.maxSize}MB` : ''}
                            ${field.accept ? `Accepted formats: ${field.accept}` : ''}
                        </div>
                    </div>
                    <input type="file" name="${field.name}" style="display: none;"
                           ${multiple} accept="${accept}" ${field.required ? 'required' : ''}>
                </div>
                <div class="file-list" style="margin-top: 12px;"></div>
            </div>
            <script>
                (function() {
                    const dropZone = document.querySelector('[data-field-id="${field.id}"] .file-drop-zone');
                    const fileInput = dropZone.querySelector('input[type="file"]');
                    const fileList = dropZone.parentNode.querySelector('.file-list');

                    dropZone.addEventListener('click', () => fileInput.click());

                    // Drag and drop events
                    dropZone.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        dropZone.style.borderColor = '#6366f1';
                        dropZone.style.backgroundColor = '#eff6ff';
                    });

                    dropZone.addEventListener('dragleave', () => {
                        dropZone.style.borderColor = '#ddd';
                        dropZone.style.backgroundColor = 'transparent';
                    });

                    dropZone.addEventListener('drop', (e) => {
                        e.preventDefault();
                        dropZone.style.borderColor = '#ddd';
                        dropZone.style.backgroundColor = 'transparent';

                        const files = Array.from(e.dataTransfer.files);
                        handleFiles(files);
                    });

                    fileInput.addEventListener('change', (e) => {
                        const files = Array.from(e.target.files);
                        handleFiles(files);
                    });

                    function handleFiles(files) {
                        fileList.innerHTML = '';
                        files.forEach(file => {
                            const fileItem = document.createElement('div');
                            fileItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f9f9f9; border-radius: 4px; margin-bottom: 4px;';
                            fileItem.innerHTML = \`
                                <span>\${file.name} (\${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                <button type="button" onclick="this.parentNode.remove()" style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 2px; cursor: pointer;">×</button>
                            \`;
                            fileList.appendChild(fileItem);
                        });
                    }
                })();
            </script>
        `;
    },

    // Date Range Picker (premium feature)
    createDateRangeField(field) {
        return `
            <div class="date-range-field" style="display: flex; gap: 12px; align-items: center;">
                <div style="flex: 1;">
                    <label style="display: block; font-size: 14px; color: #666; margin-bottom: 4px;">From</label>
                    <input type="date" name="${field.name}_start" class="field-input" ${field.required ? 'required' : ''}>
                </div>
                <div style="padding-top: 20px; color: #666;">to</div>
                <div style="flex: 1;">
                    <label style="display: block; font-size: 14px; color: #666; margin-bottom: 4px;">To</label>
                    <input type="date" name="${field.name}_end" class="field-input" ${field.required ? 'required' : ''}>
                </div>
            </div>
        `;
    },

    // Matrix/Grid questions (advanced survey feature)
    createMatrixField(field) {
        const rows = field.rows || ['Row 1', 'Row 2', 'Row 3'];
        const columns = field.columns || ['Option 1', 'Option 2', 'Option 3'];

        let matrixHtml = `
            <div class="matrix-field">
                <table style="width: 100%; border-collapse: collapse;">
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
                    ${columns.map((col, colIndex) => `
                        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #eee;">
                            <input type="radio" name="${field.name}_row_${rowIndex}" value="${col}" ${field.required && colIndex === 0 ? 'required' : ''}>
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
};

// Export for use in form generator
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedFieldTypes;
}