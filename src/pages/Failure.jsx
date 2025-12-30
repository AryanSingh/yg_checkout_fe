import React from 'react'
import { Box, Typography } from '@mui/material'

export default function Failure() {
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
        </Box>
    )
}