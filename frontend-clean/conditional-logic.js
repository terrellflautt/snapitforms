/**
 * Visual Conditional Logic Builder for SnapitForms
 * Advanced feature that JotForm charges $39/month for
 */

class ConditionalLogicBuilder {
    constructor() {
        this.rules = [];
        this.ruleCounter = 0;
        this.init();
    }

    init() {
        this.createLogicPanel();
        this.setupEventListeners();
    }

    createLogicPanel() {
        const logicPanel = document.createElement('div');
        logicPanel.id = 'conditionalLogicPanel';
        logicPanel.innerHTML = `
            <div class="logic-panel-header">
                <h3 style="margin: 0; color: #1f2937; font-size: 16px;">
                    ⚡ Conditional Logic
                    <span class="pro-badge" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px;">PRO</span>
                </h3>
                <button id="addRuleBtn" class="logic-btn primary" style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    + Add Rule
                </button>
            </div>
            <div id="logicRulesContainer" class="logic-rules-container">
                <div class="no-rules" style="text-align: center; padding: 40px; color: #6b7280;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🧠</div>
                    <p>No conditional rules yet.<br>Create smart forms that adapt based on user responses!</p>
                    <div style="font-size: 14px; color: #9ca3af; margin-top: 12px;">
                        Example: Show "Company Size" field only if user selects "Business" customer type
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #conditionalLogicPanel {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                margin-top: 20px;
                overflow: hidden;
            }

            .logic-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: #f9fafb;
                border-bottom: 1px solid #e5e7eb;
            }

            .logic-rules-container {
                padding: 20px;
                max-height: 400px;
                overflow-y: auto;
            }

            .logic-rule {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 16px;
                position: relative;
                transition: all 0.3s ease;
            }

            .logic-rule:hover {
                border-color: #6366f1;
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
            }

            .logic-rule-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .rule-title {
                font-weight: 600;
                color: #1f2937;
                font-size: 14px;
            }

            .rule-actions {
                display: flex;
                gap: 8px;
            }

            .logic-btn {
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .logic-btn.secondary {
                background: #e5e7eb;
                color: #374151;
            }

            .logic-btn.danger {
                background: #fef2f2;
                color: #dc2626;
                border: 1px solid #fecaca;
            }

            .logic-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .logic-condition {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            }

            .logic-action {
                display: flex;
                align-items: center;
                gap: 12px;
                padding-top: 12px;
                border-top: 1px solid #e2e8f0;
                margin-top: 12px;
            }

            .logic-select {
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                font-size: 14px;
                min-width: 120px;
            }

            .logic-input {
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
                min-width: 100px;
            }

            .logic-operator {
                background: #6366f1;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }

            .and-separator {
                width: 100%;
                text-align: center;
                margin: 16px 0;
                position: relative;
            }

            .and-separator::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #e2e8f0;
            }

            .and-separator span {
                background: #f8fafc;
                padding: 0 12px;
                color: #6b7280;
                font-size: 12px;
                text-transform: uppercase;
                font-weight: 500;
            }

            .preview-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);

        // Insert into properties panel
        const propertiesPanel = document.getElementById('propertiesPanel');
        if (propertiesPanel) {
            propertiesPanel.appendChild(logicPanel);
        }
    }

    setupEventListeners() {
        document.getElementById('addRuleBtn')?.addEventListener('click', () => {
            this.addRule();
        });
    }

    addRule() {
        const ruleId = `rule_${this.ruleCounter++}`;
        const rule = {
            id: ruleId,
            conditions: [this.createCondition()],
            actions: [this.createAction()]
        };

        this.rules.push(rule);
        this.renderRule(rule);
        this.hideNoRulesMessage();
    }

    createCondition() {
        return {
            id: `condition_${Date.now()}`,
            field: '',
            operator: 'equals',
            value: ''
        };
    }

    createAction() {
        return {
            id: `action_${Date.now()}`,
            type: 'show',
            target: ''
        };
    }

    renderRule(rule) {
        const container = document.getElementById('logicRulesContainer');
        const ruleElement = document.createElement('div');
        ruleElement.className = 'logic-rule';
        ruleElement.dataset.ruleId = rule.id;

        ruleElement.innerHTML = `
            <div class="preview-badge">LIVE</div>
            <div class="logic-rule-header">
                <div class="rule-title">Rule ${this.rules.length}</div>
                <div class="rule-actions">
                    <button class="logic-btn secondary" onclick="conditionalLogicBuilder.duplicateRule('${rule.id}')">
                        📋 Duplicate
                    </button>
                    <button class="logic-btn danger" onclick="conditionalLogicBuilder.deleteRule('${rule.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>

            <div class="rule-content">
                <div class="conditions-section">
                    <div style="font-weight: 500; margin-bottom: 12px; color: #374151;">
                        🎯 When these conditions are met:
                    </div>
                    ${this.renderConditions(rule.conditions, rule.id)}
                    <button class="logic-btn secondary" onclick="conditionalLogicBuilder.addCondition('${rule.id}')" style="margin-top: 8px;">
                        + Add Condition
                    </button>
                </div>

                <div class="and-separator">
                    <span>THEN</span>
                </div>

                <div class="actions-section">
                    <div style="font-weight: 500; margin-bottom: 12px; color: #374151;">
                        ⚡ Perform these actions:
                    </div>
                    ${this.renderActions(rule.actions, rule.id)}
                    <button class="logic-btn secondary" onclick="conditionalLogicBuilder.addAction('${rule.id}')" style="margin-top: 8px;">
                        + Add Action
                    </button>
                </div>
            </div>
        `;

        container.appendChild(ruleElement);
        this.updateRuleHandlers(rule.id);
    }

    renderConditions(conditions, ruleId) {
        return conditions.map((condition, index) => `
            <div class="logic-condition" data-condition-id="${condition.id}">
                ${index > 0 ? '<div class="logic-operator">AND</div>' : ''}
                <select class="logic-select" onchange="conditionalLogicBuilder.updateCondition('${ruleId}', '${condition.id}', 'field', this.value)">
                    <option value="">Select Field</option>
                    ${this.getFieldOptions(condition.field)}
                </select>
                <select class="logic-select" onchange="conditionalLogicBuilder.updateCondition('${ruleId}', '${condition.id}', 'operator', this.value)">
                    <option value="equals" ${condition.operator === 'equals' ? 'selected' : ''}>equals</option>
                    <option value="not_equals" ${condition.operator === 'not_equals' ? 'selected' : ''}>does not equal</option>
                    <option value="contains" ${condition.operator === 'contains' ? 'selected' : ''}>contains</option>
                    <option value="not_contains" ${condition.operator === 'not_contains' ? 'selected' : ''}>does not contain</option>
                    <option value="empty" ${condition.operator === 'empty' ? 'selected' : ''}>is empty</option>
                    <option value="not_empty" ${condition.operator === 'not_empty' ? 'selected' : ''}>is not empty</option>
                </select>
                ${!['empty', 'not_empty'].includes(condition.operator) ? `
                    <input type="text" class="logic-input" placeholder="Value" value="${condition.value}"
                           onchange="conditionalLogicBuilder.updateCondition('${ruleId}', '${condition.id}', 'value', this.value)">
                ` : ''}
                <button class="logic-btn danger" onclick="conditionalLogicBuilder.removeCondition('${ruleId}', '${condition.id}')">×</button>
            </div>
        `).join('');
    }

    renderActions(actions, ruleId) {
        return actions.map(action => `
            <div class="logic-action" data-action-id="${action.id}">
                <select class="logic-select" onchange="conditionalLogicBuilder.updateAction('${ruleId}', '${action.id}', 'type', this.value)">
                    <option value="show" ${action.type === 'show' ? 'selected' : ''}>Show Field</option>
                    <option value="hide" ${action.type === 'hide' ? 'selected' : ''}>Hide Field</option>
                    <option value="require" ${action.type === 'require' ? 'selected' : ''}>Make Required</option>
                    <option value="optional" ${action.type === 'optional' ? 'selected' : ''}>Make Optional</option>
                    <option value="skip" ${action.type === 'skip' ? 'selected' : ''}>Skip to Section</option>
                </select>
                <select class="logic-select" onchange="conditionalLogicBuilder.updateAction('${ruleId}', '${action.id}', 'target', this.value)">
                    <option value="">Select Target</option>
                    ${this.getFieldOptions(action.target)}
                </select>
                <button class="logic-btn danger" onclick="conditionalLogicBuilder.removeAction('${ruleId}', '${action.id}')">×</button>
            </div>
        `).join('');
    }

    getFieldOptions(selectedValue = '') {
        if (!window.formGenerator || !window.formGenerator.fields) {
            return '<option value="">No fields available</option>';
        }

        return window.formGenerator.fields.map(field =>
            `<option value="${field.id}" ${field.id === selectedValue ? 'selected' : ''}>${field.label}</option>`
        ).join('');
    }

    updateRuleHandlers(ruleId) {
        // Re-attach event handlers for dynamic content
        const ruleElement = document.querySelector(`[data-rule-id="${ruleId}"]`);

        // Update field options when form fields change
        if (window.formGenerator) {
            const originalRenderFields = window.formGenerator.renderFields;
            window.formGenerator.renderFields = function() {
                originalRenderFields.call(this);
                conditionalLogicBuilder.refreshFieldOptions();
            };
        }
    }

    refreshFieldOptions() {
        // Update all field dropdowns when form fields change
        document.querySelectorAll('.logic-condition select, .logic-action select').forEach(select => {
            if (select.querySelector('option[value=""]')?.textContent.includes('Field') ||
                select.querySelector('option[value=""]')?.textContent.includes('Target')) {
                const currentValue = select.value;
                select.innerHTML = select.querySelector('option[value=""]').outerHTML + this.getFieldOptions(currentValue);
            }
        });
    }

    // Rule management methods
    addCondition(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            rule.conditions.push(this.createCondition());
            this.rerenderRule(rule);
        }
    }

    addAction(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            rule.actions.push(this.createAction());
            this.rerenderRule(rule);
        }
    }

    updateCondition(ruleId, conditionId, property, value) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            const condition = rule.conditions.find(c => c.id === conditionId);
            if (condition) {
                condition[property] = value;
                this.applyLogicRules();
            }
        }
    }

    updateAction(ruleId, actionId, property, value) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            const action = rule.actions.find(a => a.id === actionId);
            if (action) {
                action[property] = value;
                this.applyLogicRules();
            }
        }
    }

    removeCondition(ruleId, conditionId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule && rule.conditions.length > 1) {
            rule.conditions = rule.conditions.filter(c => c.id !== conditionId);
            this.rerenderRule(rule);
        }
    }

    removeAction(ruleId, actionId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule && rule.actions.length > 1) {
            rule.actions = rule.actions.filter(a => a.id !== actionId);
            this.rerenderRule(rule);
        }
    }

    duplicateRule(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            const newRule = JSON.parse(JSON.stringify(rule));
            newRule.id = `rule_${this.ruleCounter++}`;
            newRule.conditions.forEach(c => c.id = `condition_${Date.now()}_${Math.random()}`);
            newRule.actions.forEach(a => a.id = `action_${Date.now()}_${Math.random()}`);

            this.rules.push(newRule);
            this.renderRule(newRule);
        }
    }

    deleteRule(ruleId) {
        if (confirm('Are you sure you want to delete this rule?')) {
            this.rules = this.rules.filter(r => r.id !== ruleId);
            document.querySelector(`[data-rule-id="${ruleId}"]`)?.remove();

            if (this.rules.length === 0) {
                this.showNoRulesMessage();
            }

            this.applyLogicRules();
        }
    }

    rerenderRule(rule) {
        const ruleElement = document.querySelector(`[data-rule-id="${rule.id}"]`);
        if (ruleElement) {
            ruleElement.outerHTML = '';
            this.renderRule(rule);
        }
    }

    // Logic application
    applyLogicRules() {
        if (!window.formGenerator) return;

        // Reset all fields to visible
        window.formGenerator.fields.forEach(field => {
            const fieldElement = document.querySelector(`[data-field-id="${field.id}"]`);
            if (fieldElement) {
                fieldElement.style.display = '';
                const input = fieldElement.querySelector('input, select, textarea');
                if (input) {
                    input.removeAttribute('required');
                    if (field.required) {
                        input.setAttribute('required', '');
                    }
                }
            }
        });

        // Apply each rule
        this.rules.forEach(rule => {
            if (this.evaluateRule(rule)) {
                this.executeActions(rule.actions);
            }
        });
    }

    evaluateRule(rule) {
        return rule.conditions.every(condition => this.evaluateCondition(condition));
    }

    evaluateCondition(condition) {
        if (!condition.field) return false;

        const fieldElement = document.querySelector(`[data-field-id="${condition.field}"] input, [data-field-id="${condition.field}"] select, [data-field-id="${condition.field}"] textarea`);
        if (!fieldElement) return false;

        const fieldValue = fieldElement.value || '';

        switch (condition.operator) {
            case 'equals':
                return fieldValue === condition.value;
            case 'not_equals':
                return fieldValue !== condition.value;
            case 'contains':
                return fieldValue.includes(condition.value);
            case 'not_contains':
                return !fieldValue.includes(condition.value);
            case 'empty':
                return fieldValue === '';
            case 'not_empty':
                return fieldValue !== '';
            default:
                return false;
        }
    }

    executeActions(actions) {
        actions.forEach(action => {
            if (!action.target) return;

            const fieldElement = document.querySelector(`[data-field-id="${action.target}"]`);
            if (!fieldElement) return;

            const input = fieldElement.querySelector('input, select, textarea');

            switch (action.type) {
                case 'show':
                    fieldElement.style.display = '';
                    break;
                case 'hide':
                    fieldElement.style.display = 'none';
                    if (input) input.value = '';
                    break;
                case 'require':
                    if (input) input.setAttribute('required', '');
                    break;
                case 'optional':
                    if (input) input.removeAttribute('required');
                    break;
            }
        });
    }

    hideNoRulesMessage() {
        const noRules = document.querySelector('.no-rules');
        if (noRules) noRules.style.display = 'none';
    }

    showNoRulesMessage() {
        const noRules = document.querySelector('.no-rules');
        if (noRules) noRules.style.display = 'block';
    }

    // Export/Import functionality
    exportRules() {
        return JSON.stringify(this.rules, null, 2);
    }

    importRules(rulesJson) {
        try {
            this.rules = JSON.parse(rulesJson);
            this.rerenderAllRules();
        } catch (e) {
            alert('Invalid rules format');
        }
    }

    rerenderAllRules() {
        const container = document.getElementById('logicRulesContainer');
        container.innerHTML = '';

        if (this.rules.length === 0) {
            this.showNoRulesMessage();
        } else {
            this.hideNoRulesMessage();
            this.rules.forEach(rule => this.renderRule(rule));
        }
    }
}

// Initialize conditional logic builder
document.addEventListener('DOMContentLoaded', () => {
    window.conditionalLogicBuilder = new ConditionalLogicBuilder();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConditionalLogicBuilder;
}