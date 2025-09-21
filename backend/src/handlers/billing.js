const AWS = require('aws-sdk');

exports.handler = async (event) => {
    console.log('Billing handler called', JSON.stringify(event, null, 2));

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key, X-Access-Key',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    try {
        // Return basic billing info for now
        const billingInfo = {
            plan: 'free',
            usage: {
                currentMonthSubmissions: 0,
                monthlyLimit: 1000,
                formsCreated: 0,
                formsLimit: 'unlimited'
            },
            billing: {
                nextBillingDate: null,
                amount: 0,
                currency: 'USD'
            }
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(billingInfo)
        };
    } catch (error) {
        console.error('Billing error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};