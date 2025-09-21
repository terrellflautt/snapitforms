const AWS = require('aws-sdk');

exports.handler = async (event) => {
    console.log('Dashboard handler called', JSON.stringify(event, null, 2));

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
        // Return basic dashboard data for now
        const dashboardData = {
            stats: {
                totalForms: 0,
                totalSubmissions: 0,
                monthlySubmissions: 0,
                conversionRate: 0
            },
            recentForms: [],
            recentSubmissions: []
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(dashboardData)
        };
    } catch (error) {
        console.error('Dashboard error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};