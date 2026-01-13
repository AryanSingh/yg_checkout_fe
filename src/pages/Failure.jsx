import React from 'react'
import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'

export default function Failure() {
    const location = useLocation()
    const { orderId, amount, status } = location.state || {}

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
            <Typography variant="h4" color="error.main" gutterBottom>
                Payment Failed
            </Typography>
            <Typography variant="body1">
                Payment failed or cancelled.
            </Typography>
            {orderId && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Order Number: {orderId}
                </Typography>
            )}
            {amount && (
                <Typography variant="body2">
                    Amount: ₹{amount}
                </Typography>
            )}
            {status && (
                <Typography variant="body2">
                    Status: {status}
                </Typography>
            )}
        </Box>
    )
}