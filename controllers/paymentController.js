const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
    const { amount, currency = 'brl' } = req.body;

    try {
        // Cria PaymentIntent com suporte automático a Pix, Cartão e outros métodos disponíveis
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};