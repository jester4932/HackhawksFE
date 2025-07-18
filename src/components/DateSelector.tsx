import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';
import type { TextFieldProps } from '@mui/material/TextField';

interface DateSelectorProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ startDate, endDate, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display="flex" gap={2} alignItems="center">
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(date: Date | null) => onChange(date, endDate)}
          renderInput={(params: TextFieldProps) => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(date: Date | null) => onChange(startDate, date)}
          renderInput={(params: TextFieldProps) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateSelector; 