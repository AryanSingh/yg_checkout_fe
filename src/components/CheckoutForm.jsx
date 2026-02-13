import React, { useEffect, useState } from 'react'
import { TextField, Button, Box, Alert, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'



export default function CheckoutForm() {
    const location = useLocation()

    // Security Fix: Define products locally to map IDs to prices for display. 
    // Actual price validation happens on backend.
    const PRODUCTS = {
        "100_WITH_ACCOM": {
            name: "100 Hour Yoga API with Accommodation",
            price: 900,
            currency: "EUR"
        },
        "100_WITHOUT_ACCOM": {
            name: "100 Hour Yoga API without Accommodation",
            price: 600,
            currency: "EUR"
        },
        "200_WITH_ACCOM": {
            name: "200 Hour Yoga API with Accommodation",
            price: 1800,
            currency: "EUR"
        },
        "200_WITHOUT_ACCOM": {
            name: "200 Hour Yoga API without Accommodation",
            price: 900,
            currency: "EUR"
        },
        "CUSTOM_AMOUNT": { // keeping a fallback for testing if needed, or we can remove it. Ideally strict.
            name: "Custom Payment",
            price: 5, // Dynamic
            currency: "EUR"
        }
    };

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        product_id: '100_WITH_ACCOM', // Default
        amount: 900
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const productIdFromUrl = params.get('product_id') || params.get('product') || params.get('product_url');
        // Validating if the product exists, else fallback to default
        const validProductId = PRODUCTS[productIdFromUrl] ? productIdFromUrl : '100_WITH_ACCOM';

        setForm({
            name: params.get('name') || '',
            email: params.get('email') || '',
            phone: params.get('phone') || '',
            address: params.get('address') || '',
            product_id: validProductId,
            amount: PRODUCTS[validProductId].price
        })
    }, [location.search]);

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isFormValid =
        form.name.trim() &&
        form.email.trim() &&
        isValidEmail(form.email) &&
        form.phone.trim() &&
        form.address.trim() &&
        form.product_id

    async function onSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const resp = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/initiatePayment`
                // 'https://api.purnamyogashala.com/initiatePayment'
                // 'http://localhost:5000/initiatePayment'

                , {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        address: form.address,
                        product_id: form.product_id,
                        product_url: form.product_id // Send product_url as requested
                        // Security Fix: Do NOT send amount. Backend determines amount from product_id.
                    })
                })
            if (!resp.ok) throw new Error('Failed to create payment')
            const data = await resp.json()
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl
            } else if (data.htmlForm) {
                const w = window.open('', '_self')
                w.document.write(data.htmlForm)
                w.document.close()
            } else {
                throw new Error('No payment URL returned')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                width: 400,
                mx: 'auto',
                mt: 6,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: '#fff'
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Checkout
            </Typography>
            <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                fullWidth
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                fullWidth
            />
            <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
                fullWidth
            />
            <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={onChange}
                required
                fullWidth
            />
            <TextField
                label="Product ID"
                name="product_id"
                value={form.product_id}
                disabled
                fullWidth
                helperText="Code for the selected course"
            />
            <TextField
                label="Amount (EUR)"
                name="amount"
                type="number"
                value={form.amount}
                disabled
                fullWidth
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !isFormValid}
                fullWidth
                sx={{ mt: 2 }}
            >
                {loading ? 'Processing...' : `Pay INR ${form.amount}`}
            </Button>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    )
}