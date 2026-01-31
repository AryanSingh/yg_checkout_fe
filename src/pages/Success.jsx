import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export default function Success() {
    const query = useQuery()
    const orderId = query.get('order_id')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [orderData, setOrderData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!orderId) {
            setError('No order ID found')
            // setLoading(false)
            return
        }
        fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch order status')
                return res.json()
            })
            .then(data => {
                if (data.status !== 'CHARGED') {
                    // Redirect to Failure page with order info
                    navigate('/payment-failed', { state: { orderId: data.order_id, amount: data.amount, status: data.status } })
                } else {
                    setOrderData(data)
                    // setLoading(false)
                }
            })
            .catch(err => {
                setError(err.message)
                // setLoading(false)
            }).finally(() => setLoading(false))
    }, [orderId, navigate])

    const handleDownload = () => {
        if (!orderData) return
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text('Payment Receipt', 20, 20)
        doc.setFontSize(12)
        doc.text(`Order Number: ${orderData.order_id}`, 20, 40)
        doc.text(`Amount Paid: ₹${orderData.amount}`, 20, 50)
        doc.text(`Status: ${orderData.status}`, 20, 60)
        doc.text('Thank you for your payment!', 20, 80)
        doc.save(`order_${orderData.order_id}.pdf`)
    }

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
                {loading ? "" : "Payment Successful!"}
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error.main">{error}</Typography>
            ) : (
                <>
                    <Typography variant="body1">
                        Order Number: {orderId}
                    </Typography>
                    <Typography variant="body1">
                        Amount Paid: EUR {orderData?.amount}
                    </Typography>
                    <Typography variant="body1" color="success.main" sx={{ mt: 2 }}>
                        Thank you for your payment!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={handleDownload}
                    >
                        Download PDF
                    </Button>
                </>
            )}
        </Box>
    )
}