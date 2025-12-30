import React, { useState } from 'react'
import { TextField, Button, Box, Alert, Typography } from '@mui/material'

export default function CheckoutForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        amount: 499
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

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
        form.amount && Number(form.amount) > 0

    async function onSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const resp = await fetch(
                'https://api.purnamyogashala.com/initiatePayment'
                // 'http://localhost:5000/initiatePayment'
                , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
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
                label="Amount (INR)"
                name="amount"
                type="number"
                value={form.amount}
                onChange={onChange}
                required
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !isFormValid}
                fullWidth
                sx={{ mt: 2 }}
            >
                {loading ? 'Processing...' : 'Proceed to Pay'}
            </Button>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    )
}