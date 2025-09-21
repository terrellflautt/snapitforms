const AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Pricing tier configuration
const PRICING_TIERS = {
    starter: {
        priceId: 'price_1QJcj0EpdWEENcj1VWAHZIzr',
        amount: 299,
        name: 'Starter Plan',
        submissions: 1000
    },
    basic: {
        priceId: 'price_1QJcjSEpdWEENcj1o8Fq4fDH',
        amount: 499,
        name: 'Basic Plan',
        submissions: 2500
    },
    premium: {
        priceId: 'price_1QJcjrEpdWEENcj1YVvhq8sH',
        amount: 999,
        name: 'Premium Plan',
        submissions: 5000
    },
    pro: {
        priceId: 'price_1QJck7EpdWEENcj1rKtmUWJ7',
        amount: 1499,
        name: 'Pro Plan',
        submissions: 25000
    },
    business: {
        priceId: 'price_1QJckOEpdWEENcj1d4xQJBvH',
        amount: 2999,
        name: 'Business Plan',
        submissions: 75000
    },
    enterprise: {
        priceId: 'price_1QJckhEpdWEENcj1gHLz4Rfv',
        amount: 5999,
        name: 'Enterprise Plan',
        submissions: 300000
    },
    scale: {
        priceId: 'price_1QJckzEpdWEENcj1vK8c7xJ5',
        amount: 9999,
        name: 'Scale Plan',
        submissions: 1000000
    },
    unlimited: {
        priceId: 'price_1QJclGEpdWEENcj1h9gq4QfZ',
        amount: 19999,
        name: 'Unlimited Plan',
        submissions: 2500000
    }
};

exports.handler = async (event) => {
    console.log('Stripe checkout handler invoked:', JSON.stringify(event, null, 2));

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        // Parse request body
        let requestBody;
        try {
            requestBody = JSON.parse(event.body || '{}');
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid JSON in request body'
                })
            };
        }

        const { accessKey, tier } = requestBody;

        // Validate required fields
        if (!accessKey || !tier) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: accessKey and tier'
                })
            };
        }

        // Validate tier
        const tierConfig = PRICING_TIERS[tier];
        if (!tierConfig) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: `Invalid tier: ${tier}. Available tiers: ${Object.keys(PRICING_TIERS).join(', ')}`
                })
            };
        }

        // Get user information from DynamoDB
        let userEmail = null;
        try {
            const userResult = await dynamodb.query({
                TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
                IndexName: 'AccessKeyIndex',
                KeyConditionExpression: 'accessKey = :accessKey',
                ExpressionAttributeValues: {
                    ':accessKey': accessKey
                }
            }).promise();

            if (userResult.Items && userResult.Items.length > 0) {
                userEmail = userResult.Items[0].email;
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Continue without email - Stripe can handle this
        }

        // Create Stripe checkout session
        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [{
                price: tierConfig.priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/dashboard.html?key=${accessKey}&success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/?cancelled=true`,
            metadata: {
                accessKey: accessKey,
                tier: tier,
                submissions: tierConfig.submissions.toString()
            }
        };

        // Add customer email if available
        if (userEmail) {
            sessionParams.customer_email = userEmail;
        }

        console.log('Creating Stripe session with params:', JSON.stringify(sessionParams, null, 2));

        const session = await stripe.checkout.sessions.create(sessionParams);

        console.log('Stripe session created successfully:', session.id);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                url: session.url,
                sessionId: session.id
            })
        };

    } catch (error) {
        console.error('Stripe checkout error:', error);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                error: 'Failed to create checkout session',
                message: error.message
            })
        };
    }
};