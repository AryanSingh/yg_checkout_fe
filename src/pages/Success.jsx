import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export default function Success() {
    const query = useQuery()
    const orderId = query.get('order_id')
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [orderData, setOrderData] = useState(null)

    useEffect(() => {
        if (!orderId) {
            setError('No order ID found')
            setLoading(false)
            return
        }
        fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch order status')
                return res.json()
            })
            .then(data => {
                setStatus(data.status)
                setOrderData(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [orderId])

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: '#fff',
                textAlign: 'center'
            }}
        >
            <Typography variant="h4" color="success.main" gutterBottom>
                Payment Successful!
            </Typography>
            {loading ? (
                <Typography>Loading order details...</Typography>
            ) : error ? (
                <Typography color="error.main">{error}</Typography>
            ) : (
                <>
                    <Typography variant="body1">
                        Order Number: {orderId}
                    </Typography>
                    <Typography variant="body1">
                        Amount Paid: ₹{orderData?.amount}
                    </Typography>
                    <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
                        Thank you for your payment!
                    </Typography>
                </>
            )}

        </Box>
    )
}