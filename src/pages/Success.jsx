import React from 'react'
import { Box, Typography } from '@mui/material'

export default function Success() {
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
                Payment Success
            </Typography>
            <Typography variant="body1">
                Thank you — payment completed.
            </Typography>
        </Box>
    )
}