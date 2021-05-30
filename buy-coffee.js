const testApiSecretKey = process.env.STRIPE_TEST_API_KEY;
const liveApiSecretKey = process.env.STRIPE_LIVE_API_KEY;
const isProduction = false;

const stripe = require('stripe')(isProduction ? liveApiSecretKey : testApiSecretKey);

exports.handler = async (event) => {
    try {
        // Create payment method
        let paymentMethod;
        try {
            paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: event.cardNumber,
                    exp_month: event.cardExpirationMonth,
                    exp_year: event.cardExpirationYear,
                    cvc: event.cardSecurityCode
                },
            });
            console.log('Created payment method', paymentMethod);
        } catch (error) {
            console.log('Could not create payment method', error)
            throw error;
        }
        // Create payment intent
        let paymentIntent;
        try {
            const price = 10;
            if (paymentMethod.id) {
                paymentIntent = await stripe.paymentIntents.create({
                    amount: 1 * 100 * price,
                    currency: 'mxn',
                    payment_method_types: ['card'],
                    description: 'Payment intent for buying a coffee', // optional
                    metadata: {
                        order: `A cup of coffee $${price}`
                    },
                    payment_method: paymentMethod.id,
                    receipt_email: 'bmondragonbrozon@gmail.com', // optional
                });
                console.log('Created payment intent', paymentIntent);
            } else {
                const msg = 'This payment flow required a valid payment method id';
                console.log(msg);
                throw new Error(msg);
            }
        } catch (error) {
            console.log('Could not create payment intent', error);
            throw error;
        }
        // Confirm
        try {
            if (paymentIntent.id) {
                paymentIntent = await stripe.paymentIntents.confirm(
                    paymentIntent.id
                );
                console.log('Confirmed payment intent', paymentIntent);
            } else {
                const msg = 'Cannot confirm payment intent withoud a valid payment intent id';
                console.log(msg);
                throw new Error(msg);
            }
        } catch (error) {
            console.log('Could not confirm payment intent', error);
            throw error;
        }
        return {
            success: true,
            errorMessage: null
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            errorMessage: error.errorMessage
        };
    }
};

//exports.handler();
