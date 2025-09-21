const AWS = require('aws-sdk');

exports.submit = async (event) => {
    console.log('Submissions submit handler called', JSON.stringify(event, null, 2));

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
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Form submitted successfully' })
        };
    } catch (error) {
        console.error('Submission error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

exports.list = async (event) => {
    console.log('Submissions list handler called', JSON.stringify(event, null, 2));

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
        // Return empty submissions list for now
        const submissions = [];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ submissions })
        };
    } catch (error) {
        console.error('Submissions list error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};