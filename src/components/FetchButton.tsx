import React, { useMemo } from 'react';
import { Button, CircularProgress } from '@mui/material';
// @ts-expect-error: no types for lodash.debounce in this setup
import debounce from 'lodash.debounce';

interface FetchButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

const FetchButton: React.FC<FetchButtonProps> = ({ onClick, loading, disabled }) => {
  // Debounce the onClick handler
  const debouncedClick = useMemo(() => debounce(onClick, 500, { leading: true, trailing: false }), [onClick]);

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={debouncedClick}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={20} /> : null}
      sx={{ minWidth: 140 }}
    >
      {loading ? 'Loading...' : 'Fetch Data'}
    </Button>
  );
};

export default FetchButton; 