import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export type MetricType = 'commits' | 'additions' | 'deletions' | 'total_changes';

export interface TimelineDataPoint {
  day: string; // 'Sun', 'Mon', ...
  value: number;
}

interface TimelineChartProps {
  data: TimelineDataPoint[];
  metricType: MetricType;
  author?: string;
  onMetricTypeChange: (type: MetricType) => void;
  onAuthorChange: (author: string) => void;
  authors: string[];
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TimelineChart: React.FC<TimelineChartProps> = ({ data, metricType, author, onMetricTypeChange, onAuthorChange, authors }) => {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Typography variant="h6">Activity by Day of Week</Typography>
          <Box display="flex" gap={2}>
            <FormControl size="small">
              <InputLabel id="metric-type-label">Metric</InputLabel>
              <Select
                labelId="metric-type-label"
                value={metricType}
                label="Metric"
                onChange={e => onMetricTypeChange(e.target.value as MetricType)}
              >
                <MenuItem value="commits">Commits</MenuItem>
                <MenuItem value="additions">Additions</MenuItem>
                <MenuItem value="deletions">Deletions</MenuItem>
                <MenuItem value="total_changes">Total Changes</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel id="author-label">Author</InputLabel>
              <Select
                labelId="author-label"
                value={author || ''}
                label="Author"
                onChange={e => onAuthorChange(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Authors</MenuItem>
                {authors.map(a => (
                  <MenuItem key={a} value={a}>{a}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={daysOfWeek.map(day => data.find(d => d.day === day) || { day, value: 0 })}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name={metricType.replace('_', ' ').toUpperCase()} fill="#1976d2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimelineChart; 