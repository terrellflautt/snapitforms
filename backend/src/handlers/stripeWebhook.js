const AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Stripe webhook received:', JSON.stringify(event, null, 2));

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
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
        const signature = event.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let stripeEvent;
        try {
            stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid signature'
                })
            };
        }

        console.log('Stripe event type:', stripeEvent.type);

        // Handle different webhook events
        switch (stripeEvent.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(stripeEvent.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(stripeEvent.data.object);
                break;
            case 'invoice.payment_failed':
                await handlePaymentFailed(stripeEvent.data.object);
                break;
            case 'customer.subscription.created':
                await handleSubscriptionCreated(stripeEvent.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(stripeEvent.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(stripeEvent.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${stripeEvent.type}`);
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                received: true
            })
        };

    } catch (error) {
        console.error('Webhook error:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                error: 'Webhook processing failed',
                message: error.message
            })
        };
    }
};

async function handleCheckoutSessionCompleted(session) {
    console.log('Processing checkout session completed:', session.id);

    const { accessKey, tier, submissions } = session.metadata;

    if (!accessKey) {
        console.error('No accessKey in session metadata');
        return;
    }

    try {
        // Update user subscription in DynamoDB
        await dynamodb.update({
            TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
            Key: { accessKey: accessKey },
            UpdateExpression: 'SET subscriptionTier = :tier, subscriptionStatus = :status, stripeCustomerId = :customerId, stripeSessionId = :sessionId, maxSubmissions = :maxSubmissions, updatedAt = :now',
            ExpressionAttributeValues: {
                ':tier': tier,
                ':status': 'active',
                ':customerId': session.customer,
                ':sessionId': session.id,
                ':maxSubmissions': parseInt(submissions),
                ':now': new Date().toISOString()
            }
        }).promise();

        console.log(`Successfully updated subscription for user ${accessKey} to ${tier} tier`);

    } catch (error) {
        console.error('Failed to update user subscription:', error);
        throw error;
    }
}

async function handlePaymentSucceeded(invoice) {
    console.log('Processing payment succeeded:', invoice.id);

    const customerId = invoice.customer;

    try {
        // Find user by Stripe customer ID
        const userResult = await dynamodb.query({
            TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
            IndexName: 'StripeCustomerIndex',
            KeyConditionExpression: 'stripeCustomerId = :customerId',
            ExpressionAttributeValues: {
                ':customerId': customerId
            }
        }).promise();

        if (userResult.Items && userResult.Items.length > 0) {
            const user = userResult.Items[0];

            // Update payment status
            await dynamodb.update({
                TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
                Key: { accessKey: user.accessKey },
                UpdateExpression: 'SET subscriptionStatus = :status, lastPaymentDate = :paymentDate, updatedAt = :now',
                ExpressionAttributeValues: {
                    ':status': 'active',
                    ':paymentDate': new Date(invoice.created * 1000).toISOString(),
                    ':now': new Date().toISOString()
                }
            }).promise();

            console.log(`Payment succeeded for user ${user.accessKey}`);
        }

    } catch (error) {
        console.error('Failed to process payment succeeded:', error);
        throw error;
    }
}

async function handlePaymentFailed(invoice) {
    console.log('Processing payment failed:', invoice.id);

    const customerId = invoice.customer;

    try {
        // Find user by Stripe customer ID
        const userResult = await dynamodb.query({
            TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
            IndexName: 'StripeCustomerIndex',
            KeyConditionExpression: 'stripeCustomerId = :customerId',
            ExpressionAttributeValues: {
                ':customerId': customerId
            }
        }).promise();

        if (userResult.Items && userResult.Items.length > 0) {
            const user = userResult.Items[0];

            // Update payment status
            await dynamodb.update({
                TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
                Key: { accessKey: user.accessKey },
                UpdateExpression: 'SET subscriptionStatus = :status, updatedAt = :now',
                ExpressionAttributeValues: {
                    ':status': 'payment_failed',
                    ':now': new Date().toISOString()
                }
            }).promise();

            console.log(`Payment failed for user ${user.accessKey}`);
        }

    } catch (error) {
        console.error('Failed to process payment failed:', error);
        throw error;
    }
}

async function handleSubscriptionCreated(subscription) {
    console.log('Processing subscription created:', subscription.id);
    // Additional logic for subscription creation if needed
}

async function handleSubscriptionUpdated(subscription) {
    console.log('Processing subscription updated:', subscription.id);

    const customerId = subscription.customer;
    const status = subscription.status;

    try {
        // Find user by Stripe customer ID
        const userResult = await dynamodb.query({
            TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
            IndexName: 'StripeCustomerIndex',
            KeyConditionExpression: 'stripeCustomerId = :customerId',
            ExpressionAttributeValues: {
                ':customerId': customerId
            }
        }).promise();

        if (userResult.Items && userResult.Items.length > 0) {
            const user = userResult.Items[0];

            // Update subscription status
            await dynamodb.update({
                TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
                Key: { accessKey: user.accessKey },
                UpdateExpression: 'SET subscriptionStatus = :status, stripeSubscriptionId = :subscriptionId, updatedAt = :now',
                ExpressionAttributeValues: {
                    ':status': status,
                    ':subscriptionId': subscription.id,
                    ':now': new Date().toISOString()
                }
            }).promise();

            console.log(`Subscription updated for user ${user.accessKey} to status ${status}`);
        }

    } catch (error) {
        console.error('Failed to process subscription updated:', error);
        throw error;
    }
}

async function handleSubscriptionDeleted(subscription) {
    console.log('Processing subscription deleted:', subscription.id);

    const customerId = subscription.customer;

    try {
        // Find user by Stripe customer ID
        const userResult = await dynamodb.query({
            TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
            IndexName: 'StripeCustomerIndex',
            KeyConditionExpression: 'stripeCustomerId = :customerId',
            ExpressionAttributeValues: {
                ':customerId': customerId
            }
        }).promise();

        if (userResult.Items && userResult.Items.length > 0) {
            const user = userResult.Items[0];

            // Update subscription status to cancelled
            await dynamodb.update({
                TableName: process.env.USERS_TABLE || 'snapitforms-api-new-production-users',
                Key: { accessKey: user.accessKey },
                UpdateExpression: 'SET subscriptionStatus = :status, subscriptionTier = :tier, maxSubmissions = :maxSubmissions, updatedAt = :now',
                ExpressionAttributeValues: {
                    ':status': 'cancelled',
                    ':tier': 'free',
                    ':maxSubmissions': 1000, // Default free tier limit
                    ':now': new Date().toISOString()
                }
            }).promise();

            console.log(`Subscription cancelled for user ${user.accessKey}`);
        }

    } catch (error) {
        console.error('Failed to process subscription deleted:', error);
        throw error;
    }
}