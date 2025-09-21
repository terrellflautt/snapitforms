const AWS = require('aws-sdk');

// Configure AWS SES
const ses = new AWS.SES({
    region: process.env.SES_REGION || 'us-east-1'
});

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key, X-Access-Key',
    'Content-Type': 'application/json'
};

// Send email handler
exports.sendEmail = async (event) => {
    console.log('Email handler called', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { to, subject, htmlBody, textBody, fromName, replyTo, attachments } = body;

        // Validate required fields
        if (!to || !subject || (!htmlBody && !textBody)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required fields: to, subject, and body content'
                })
            };
        }

        const fromEmail = process.env.SES_FROM_EMAIL || 'noreply@snapitforms.com';
        const fromAddress = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

        // Prepare email parameters
        const emailParams = {
            Source: fromAddress,
            Destination: {
                ToAddresses: Array.isArray(to) ? to : [to]
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: 'UTF-8'
                },
                Body: {}
            }
        };

        // Add reply-to if provided
        if (replyTo) {
            emailParams.ReplyToAddresses = [replyTo];
        }

        // Add body content
        if (htmlBody) {
            emailParams.Message.Body.Html = {
                Data: htmlBody,
                Charset: 'UTF-8'
            };
        }

        if (textBody) {
            emailParams.Message.Body.Text = {
                Data: textBody,
                Charset: 'UTF-8'
            };
        }

        // Send the email
        const result = await ses.sendEmail(emailParams).promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                messageId: result.MessageId,
                message: 'Email sent successfully'
            })
        };

    } catch (error) {
        console.error('Email sending error:', error);

        // Handle specific SES errors
        let errorMessage = 'Failed to send email';
        if (error.code === 'MessageRejected') {
            errorMessage = 'Email was rejected. Please check the recipient address.';
        } else if (error.code === 'MailFromDomainNotVerified') {
            errorMessage = 'Sender domain not verified with SES.';
        } else if (error.code === 'ConfigurationSetDoesNotExist') {
            errorMessage = 'Email configuration issue. Please contact support.';
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: errorMessage,
                details: error.message
            })
        };
    }
};

// Send form submission notification
exports.sendFormNotification = async (event) => {
    console.log('Form notification handler called', JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { formData, formName, ownerEmail, submissionId } = body;

        if (!formData || !ownerEmail) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Missing required fields: formData and ownerEmail'
                })
            };
        }

        // Generate email content
        const subject = `New ${formName || 'Form'} Submission - SnapIT Forms`;

        const htmlBody = this.generateFormNotificationHTML(formData, formName, submissionId);
        const textBody = this.generateFormNotificationText(formData, formName, submissionId);

        // Send notification email
        const emailResult = await this.sendEmail({
            body: JSON.stringify({
                to: ownerEmail,
                subject: subject,
                htmlBody: htmlBody,
                textBody: textBody,
                fromName: 'SnapIT Forms',
                replyTo: formData.email || undefined
            })
        });

        return emailResult;

    } catch (error) {
        console.error('Form notification error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to send form notification',
                details: error.message
            })
        };
    }
};

// Generate HTML email for form notifications
exports.generateFormNotificationHTML = (formData, formName, submissionId) => {
    const timestamp = new Date().toLocaleString();

    let formFields = '';
    for (const [key, value] of Object.entries(formData)) {
        if (key !== 'access_key') {
            formFields += `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600; text-transform: capitalize;">
                        ${key.replace(/_/g, ' ')}:
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">
                        ${Array.isArray(value) ? value.join(', ') : value}
                    </td>
                </tr>
            `;
        }
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>New Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📝 New Form Submission</h1>
                </div>

                <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
                    <p style="margin-top: 0;"><strong>Form:</strong> ${formName || 'Contact Form'}</p>
                    <p><strong>Submitted:</strong> ${timestamp}</p>
                    <p><strong>Submission ID:</strong> ${submissionId || 'N/A'}</p>

                    <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px;">
                        Submission Details
                    </h3>

                    <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 4px;">
                        ${formFields}
                    </table>

                    <div style="margin-top: 20px; padding: 15px; background: #e8f2ff; border-radius: 4px; border-left: 4px solid #667eea;">
                        <p style="margin: 0; font-size: 14px;">
                            🚀 <strong>Powered by SnapIT Forms</strong><br>
                            Manage your forms at: <a href="https://snapitforms.com/dashboard.html" style="color: #667eea;">snapitforms.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Generate text email for form notifications
exports.generateFormNotificationText = (formData, formName, submissionId) => {
    const timestamp = new Date().toLocaleString();

    let formFields = '';
    for (const [key, value] of Object.entries(formData)) {
        if (key !== 'access_key') {
            formFields += `${key.replace(/_/g, ' ').toUpperCase()}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
        }
    }

    return `
NEW FORM SUBMISSION - SNAPIT FORMS

Form: ${formName || 'Contact Form'}
Submitted: ${timestamp}
Submission ID: ${submissionId || 'N/A'}

SUBMISSION DETAILS:
${formFields}

---
Powered by SnapIT Forms
Manage your forms at: https://snapitforms.com/dashboard.html
    `.trim();
};

// Test SES configuration
exports.testSES = async (event) => {
    console.log('SES test handler called');

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        // Send a test email to verify SES is working
        const testEmail = {
            to: process.env.SES_TEST_EMAIL || 'test@snapitforms.com',
            subject: 'SnapIT Forms - SES Test Email',
            htmlBody: `
                <h2>🎉 SES Test Successful!</h2>
                <p>Your Amazon Simple Email Service is configured correctly.</p>
                <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
                <p><em>This is an automated test from SnapIT Forms.</em></p>
            `,
            textBody: `
SES Test Successful!

Your Amazon Simple Email Service is configured correctly.
Test Time: ${new Date().toISOString()}

This is an automated test from SnapIT Forms.
            `.trim(),
            fromName: 'SnapIT Forms Test'
        };

        const result = await this.sendEmail({
            httpMethod: 'POST',
            body: JSON.stringify(testEmail)
        });

        const response = JSON.parse(result.body);

        if (result.statusCode === 200) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'SES test email sent successfully',
                    messageId: response.messageId
                })
            };
        } else {
            throw new Error(response.error || 'Test email failed');
        }

    } catch (error) {
        console.error('SES test error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'SES test failed',
                details: error.message
            })
        };
    }
};