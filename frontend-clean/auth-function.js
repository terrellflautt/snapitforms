// Minimal CORS fix for snapitforms auth endpoint
const aws = require('aws-sdk');

exports.handler = async (event) => {
    console.log('Auth CORS fix handler called:', event.httpMethod, event.path);
    
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,Accept,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Service,X-Google-Token,X-User-ID',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
        'Access-Control-Allow-Credentials': 'false'
    };
    
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }
    
    // For POST requests, forward to the working fallback API
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body || '{}');
            console.log('Forwarding auth request with body:', body);
            
            // Call the working auth endpoint directly
            const https = require('https');
            const data = JSON.stringify(body);
            
            const options = {
                hostname: 'dnxslxuth3.execute-api.us-east-1.amazonaws.com',
                port: 443,
                path: '/production/auth/google',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };
            
            const response = await new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let responseData = '';
                    res.on('data', (chunk) => {
                        responseData += chunk;
                    });
                    res.on('end', () => {
                        resolve({
                            statusCode: res.statusCode,
                            data: responseData
                        });
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.write(data);
                req.end();
            });
            
            // Parse the response and add access key if missing
            let responseBody;
            try {
                responseBody = JSON.parse(response.data);
            } catch (e) {
                responseBody = { success: false, error: 'Invalid response from auth service' };
            }
            
            // If response is successful but missing access key, generate one
            if (responseBody.success && !responseBody.user?.accessKey) {
                const crypto = require('crypto');
                const accessKey = `sa_${crypto.randomBytes(16).toString('hex')}`;
                
                responseBody.user = responseBody.user || {};
                responseBody.user.accessKey = accessKey;
                responseBody.accessKey = accessKey;
                
                console.log('Generated access key for successful auth:', accessKey);
            }
            
            return {
                statusCode: response.statusCode || 200,
                headers: corsHeaders,
                body: JSON.stringify(responseBody)
            };
            
        } catch (error) {
            console.error('Auth forwarding error:', error);
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Authentication service error',
                    details: error.message
                })
            };
        }
    }
    
    return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};