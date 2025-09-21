/**
 * SnapIT Forms Agent - AI-Powered Form Assistant
 * Intelligent agent for form creation, optimization, and management
 */

class SnapITFormsAgent {
    constructor() {
        this.apiBaseUrl = 'https://api.snapitforms.com';
        this.accessKey = this.getAccessKey();
        this.isInitialized = false;
        this.currentConversation = [];
        this.agentPersonality = {
            name: "FormAI",
            role: "Your AI Form Builder Assistant",
            capabilities: [
                "Create forms from natural language descriptions",
                "Optimize existing forms for better conversion",
                "Analyze form performance and suggest improvements",
                "Generate form templates for specific industries",
                "Provide form best practices and tips"
            ]
        };
    }

    // Initialize the agent
    async init() {
        console.log('🤖 SnapIT Forms Agent initializing...');
        this.createAgentInterface();
        this.bindEventListeners();
        this.isInitialized = true;
        console.log('✅ SnapIT Forms Agent ready!');
        this.showWelcomeMessage();
    }

    // Get access key from URL or localStorage
    getAccessKey() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('key') || localStorage.getItem('accessKey') || null;
    }

    // Create the agent UI interface
    createAgentInterface() {
        const agentHTML = `
            <div id="snapit-agent" class="agent-container">
                <div class="agent-header">
                    <div class="agent-avatar">🤖</div>
                    <div class="agent-info">
                        <h3>${this.agentPersonality.name}</h3>
                        <p>${this.agentPersonality.role}</p>
                    </div>
                    <button id="agent-toggle" class="agent-toggle">💬</button>
                </div>

                <div id="agent-chat" class="agent-chat hidden">
                    <div class="agent-messages" id="agent-messages">
                        <!-- Messages will be added here -->
                    </div>

                    <div class="agent-input-container">
                        <textarea
                            id="agent-input"
                            placeholder="Ask me to create a form, optimize your existing forms, or get suggestions..."
                            rows="3"
                        ></textarea>
                        <button id="agent-send" class="agent-send-btn">Send</button>
                    </div>

                    <div class="agent-quick-actions">
                        <button class="quick-action" data-action="create-contact-form">Create Contact Form</button>
                        <button class="quick-action" data-action="analyze-forms">Analyze My Forms</button>
                        <button class="quick-action" data-action="suggest-improvements">Suggest Improvements</button>
                        <button class="quick-action" data-action="show-templates">Show Templates</button>
                    </div>
                </div>
            </div>
        `;

        // Add to page
        document.body.insertAdjacentHTML('beforeend', agentHTML);
        this.addAgentStyles();
    }

    // Add CSS styles for the agent
    addAgentStyles() {
        const styles = `
            <style>
                .agent-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 350px;
                    max-height: 500px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .agent-header {
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: white;
                    cursor: pointer;
                }

                .agent-avatar {
                    font-size: 24px;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .agent-info h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .agent-info p {
                    margin: 2px 0 0;
                    font-size: 12px;
                    opacity: 0.9;
                }

                .agent-toggle {
                    margin-left: auto;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .agent-toggle:hover {
                    background: rgba(255,255,255,0.3);
                }

                .agent-chat {
                    background: white;
                    border-radius: 0 0 15px 15px;
                    max-height: 400px;
                    display: flex;
                    flex-direction: column;
                }

                .agent-chat.hidden {
                    display: none;
                }

                .agent-messages {
                    flex: 1;
                    padding: 15px;
                    max-height: 250px;
                    overflow-y: auto;
                    border-bottom: 1px solid #eee;
                }

                .message {
                    margin-bottom: 12px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    max-width: 85%;
                }

                .message.agent {
                    background: #f0f4ff;
                    align-self: flex-start;
                }

                .message.user {
                    background: #667eea;
                    color: white;
                    align-self: flex-end;
                    margin-left: auto;
                }

                .agent-input-container {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    gap: 10px;
                }

                #agent-input {
                    flex: 1;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 8px 12px;
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                }

                .agent-send-btn {
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-weight: 500;
                }

                .agent-send-btn:hover {
                    background: #5a6fd8;
                }

                .agent-quick-actions {
                    padding: 10px 15px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .quick-action {
                    background: #f8f9ff;
                    border: 1px solid #e1e6ff;
                    border-radius: 6px;
                    padding: 4px 8px;
                    font-size: 11px;
                    cursor: pointer;
                    color: #667eea;
                }

                .quick-action:hover {
                    background: #667eea;
                    color: white;
                }

                @media (max-width: 768px) {
                    .agent-container {
                        width: calc(100vw - 40px);
                        right: 20px;
                        left: 20px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Bind event listeners
    bindEventListeners() {
        // Toggle chat visibility
        document.getElementById('agent-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        // Send message on button click
        document.getElementById('agent-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter (but not Shift+Enter)
        document.getElementById('agent-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    // Toggle chat window
    toggleChat() {
        const chat = document.getElementById('agent-chat');
        chat.classList.toggle('hidden');

        if (!chat.classList.contains('hidden')) {
            document.getElementById('agent-input').focus();
        }
    }

    // Show welcome message
    showWelcomeMessage() {
        const welcomeMessage = `Hello! I'm ${this.agentPersonality.name}, your AI form assistant. I can help you:

• Create forms from simple descriptions
• Optimize existing forms for better results
• Analyze your form performance
• Suggest improvements and best practices

What would you like to do today?`;

        this.addMessage(welcomeMessage, 'agent');
    }

    // Add message to chat
    addMessage(content, sender = 'agent') {
        const messagesContainer = document.getElementById('agent-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send user message
    async sendMessage() {
        const input = document.getElementById('agent-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Process message with AI
        const response = await this.processMessage(message);
        this.addMessage(response, 'agent');
    }

    // Process message with AI logic
    async processMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Form creation requests
        if (lowerMessage.includes('create') && (lowerMessage.includes('form') || lowerMessage.includes('contact'))) {
            return await this.handleFormCreation(message);
        }

        // Analysis requests
        if (lowerMessage.includes('analyze') || lowerMessage.includes('performance')) {
            return await this.handleFormAnalysis();
        }

        // Optimization requests
        if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
            return await this.handleOptimization();
        }

        // Template requests
        if (lowerMessage.includes('template')) {
            return this.handleTemplateRequest();
        }

        // General help
        return this.handleGeneralQuery(message);
    }

    // Handle form creation
    async handleFormCreation(message) {
        const formType = this.detectFormType(message);

        return `I'll help you create a ${formType}! Based on your request, I suggest these fields:

${this.generateFieldSuggestions(formType)}

Would you like me to:
1. Create this form automatically
2. Customize the fields first
3. Show more options

Just let me know!`;
    }

    // Detect form type from message
    detectFormType(message) {
        const types = {
            'contact': ['contact', 'get in touch', 'reach out'],
            'newsletter': ['newsletter', 'signup', 'subscribe'],
            'feedback': ['feedback', 'review', 'opinion'],
            'survey': ['survey', 'questionnaire', 'poll'],
            'registration': ['register', 'sign up', 'join'],
            'order': ['order', 'purchase', 'buy']
        };

        for (const [type, keywords] of Object.entries(types)) {
            if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
                return type;
            }
        }

        return 'contact';
    }

    // Generate field suggestions
    generateFieldSuggestions(formType) {
        const suggestions = {
            'contact': '• Name (required)\n• Email (required)\n• Subject\n• Message (required)\n• Phone (optional)',
            'newsletter': '• Email (required)\n• First Name\n• Preferences/Interests\n• Frequency',
            'feedback': '• Name\n• Email\n• Rating (1-5 stars)\n• Comments\n• Recommendation',
            'survey': '• Demographics\n• Multiple choice questions\n• Rating scales\n• Open-ended questions',
            'registration': '• Full Name (required)\n• Email (required)\n• Password\n• Confirm Password\n• Terms agreement',
            'order': '• Product selection\n• Quantity\n• Customer details\n• Shipping address\n• Payment method'
        };

        return suggestions[formType] || suggestions['contact'];
    }

    // Handle form analysis
    async handleFormAnalysis() {
        try {
            // In a real implementation, this would fetch actual form data
            return `📊 Form Performance Analysis:

Based on your current forms:
• Total Forms: 3
• Total Submissions: 42
• Average Conversion Rate: 12.4%

🎯 Recommendations:
• Your contact form has the highest engagement
• Consider adding progress indicators to longer forms
• Mobile optimization could improve conversion by ~15%

Would you like detailed analysis of a specific form?`;
        } catch (error) {
            return "I'm having trouble accessing your form data right now. Please try again in a moment.";
        }
    }

    // Handle optimization suggestions
    async handleOptimization() {
        return `🚀 Form Optimization Tips:

1. **Reduce Form Fields**: Each additional field reduces conversion by ~7%
2. **Clear Call-to-Action**: Use action words like "Get Started" instead of "Submit"
3. **Mobile-First Design**: 60% of submissions come from mobile
4. **Progress Indicators**: Show completion progress for multi-step forms
5. **Error Handling**: Provide clear, helpful error messages

Which form would you like me to analyze and optimize?`;
    }

    // Handle template requests
    handleTemplateRequest() {
        return `📝 Available Form Templates:

🏢 **Business**
• Contact Forms
• Quote Requests
• Service Bookings

👥 **Marketing**
• Newsletter Signups
• Lead Generation
• Event Registration

📊 **Research**
• Customer Surveys
• Feedback Forms
• Market Research

Which category interests you? I can create a custom template based on your needs!`;
    }

    // Handle general queries
    handleGeneralQuery(message) {
        return `I understand you're asking about: "${message}"

I can help you with:
• Creating new forms from descriptions
• Analyzing form performance
• Optimizing existing forms
• Suggesting best practices
• Providing templates

Could you be more specific about what you'd like to do? For example:
"Create a contact form for my restaurant"
"Analyze my newsletter signup form"
"Show me feedback form templates"`;
    }

    // Handle quick actions
    handleQuickAction(action) {
        const input = document.getElementById('agent-input');

        const actionMessages = {
            'create-contact-form': 'Create a professional contact form for my business',
            'analyze-forms': 'Analyze my current form performance and metrics',
            'suggest-improvements': 'Suggest improvements for my existing forms',
            'show-templates': 'Show me available form templates'
        };

        input.value = actionMessages[action] || '';
        this.sendMessage();
    }

    // API helper methods
    async apiCall(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.accessKey) {
            headers['X-Access-Key'] = this.accessKey;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call error:', error);
            return null;
        }
    }
}

// Initialize the agent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.snapitFormsAgent = new SnapITFormsAgent();
    window.snapitFormsAgent.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnapITFormsAgent;
}