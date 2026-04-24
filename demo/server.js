// server.js
const express = require('express');
require('dotenv').config({ path: '../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // REPLACE THIS!
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('.')); // Serve your HTML file

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { name, amount } = req.body;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: name,
                        },
                        unit_amount: amount, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:4242/success.html',
            cancel_url: 'http://localhost:4242/cancel.html',
        });
        
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(4242, () => console.log('🚀 Server running on http://localhost:4242'));