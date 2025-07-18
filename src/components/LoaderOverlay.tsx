import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderOverlayProps {
  open: boolean;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ open }) => {
  if (!open) return null;
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="rgba(255,255,255,0.7)"
      zIndex={2000}
      sx={{ pointerEvents: 'all' }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress size={60} thickness={5} />
        <Typography variant="h6" color="text.secondary" fontWeight={500}>
          Please Wait…
        </Typography>
      </Box>
    </Box>
  );
};

export default LoaderOverlay; 