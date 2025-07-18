import { Container, CssBaseline, Box, Typography, Paper } from '@mui/material';
import DateSelector from './components/DateSelector';
import HighDeviationCommitsTable from './components/HighDeviationCommitsTable';
import TimelineChart from './components/TimelineChart';
import WordCloudChart from './components/WordCloudChart';
import type { TimelineDataPoint, MetricType } from './components/TimelineChart';
import type { WordCloudDatum } from './components/WordCloudChart';
import LoaderOverlay from './components/LoaderOverlay';
import FetchButton from './components/FetchButton';
import { useState, useEffect, useCallback } from 'react';
import reactLogo from './assets/react.svg'
import './App.css'
import type { CommitDeviation } from './types/CommitDeviation';
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:3000';

const LOCAL_CACHE_KEY = 'commit-analytics-cache-v1';

function App() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Table state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(20); // mock total
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CommitDeviation[]>([
    { sha: 'abc1234', title: 'Fix bug in AI logic', author: 'alice', date: new Date().toISOString(), totalChanges: 120 },
    { sha: 'def5678', title: 'Major refactor of rendering engine', author: 'bob', date: new Date().toISOString(), totalChanges: 300 },
  ]);

  // Timeline chart state
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([
    { day: 'Sun', value: 5 },
    { day: 'Mon', value: 8 },
    { day: 'Tue', value: 12 },
    { day: 'Wed', value: 7 },
    { day: 'Thu', value: 10 },
    { day: 'Fri', value: 15 },
    { day: 'Sat', value: 3 },
  ]);
  const [metricType, setMetricType] = useState<MetricType>('commits');
  const [author, setAuthor] = useState<string>('');
  const [authors, setAuthors] = useState<string[]>(['alice', 'bob']);

  // Word cloud state
  const [wordCloudData, setWordCloudData] = useState<WordCloudDatum[]>([
    { text: 'fix', value: 20 },
    { text: 'bug', value: 15 },
    { text: 'feature', value: 10 },
    { text: 'refactor', value: 8 },
    { text: 'test', value: 12 },
    { text: 'performance', value: 6 },
    { text: 'update', value: 9 },
    { text: 'remove', value: 7 },
    { text: 'add', value: 11 },
    { text: 'optimize', value: 5 },
  ]);

  // Load cached data on mount
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.data) setData(parsed.data);
        if (parsed.timelineData) setTimelineData(parsed.timelineData);
        if (parsed.wordCloudData) setWordCloudData(parsed.wordCloudData);
      } catch {}
    }
  }, []);

  // Cache data on change
  useEffect(() => {
    localStorage.setItem(
      LOCAL_CACHE_KEY,
      JSON.stringify({ data, timelineData, wordCloudData })
    );
  }, [data, timelineData, wordCloudData]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
    // Here you would trigger a data fetch for the new page
  };

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    const from = startDate.toISOString().slice(0, 10);
    const to = endDate.toISOString().slice(0, 10);
    try {
      // Fetch all endpoints in parallel
      const commitMetricsParams: any = { from, to, metric_type: metricType };
      if (author) commitMetricsParams.author = author;
      const [authorsRes, commitsRes, metricsRes, wordCloudRes] = await Promise.all([
        axios.get('/api/v1/github/analytics/unique_authors', { params: { from, to } }),
        axios.get('/api/v1/github/analytics/significant_commits', { params: { from, to } }),
        axios.get('/api/v1/github/analytics/commit_metrics', { params: commitMetricsParams }),
        axios.get('/api/v1/github/analytics/message_word_frequency', { params: { from, to } }),
      ]);
      // Update authors
      setAuthors(Array.isArray(authorsRes.data.authors) ? authorsRes.data.authors : []);
      // Update table data
      setData(Array.isArray(commitsRes.data)
        ? commitsRes.data.map((item: any) => ({
            sha: item.sha || 'N/A',
            title: item.message || item.title || 'N/A',
            author: item.author || 'N/A',
            date: item.date || 'N/A',
            totalChanges: typeof item.totalChanges === 'number' ? item.totalChanges : 0,
          }))
        : []);
      // Update timeline data
      let timeline: TimelineDataPoint[] = [];
      if (Array.isArray(metricsRes.data)) {
        timeline = metricsRes.data.map((item: any) => ({
          day: item.day || 'N/A',
          value: typeof item.value === 'number' ? item.value : 0,
        }));
      } else if (typeof metricsRes.data.count === 'number') {
        timeline = [{ day: 'All', value: metricsRes.data.count }];
      } else {
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        timeline = weekDays.map(day => ({ day, value: 0 }));
      }
      setTimelineData(timeline);
      // Update word cloud
      let wcArr: WordCloudDatum[] = [];
      if (metricsRes.data.frequencies) {
        wcArr = Object.entries(metricsRes.data.frequencies).map(([text, value]) => ({ text, value: value as number }));
      } else if (wordCloudRes.data.frequencies) {
        wcArr = Object.entries(wordCloudRes.data.frequencies).map(([text, value]) => ({ text, value: value as number }));
      }
      setWordCloudData(Array.isArray(wcArr) && wcArr.length > 0 ? wcArr : [{ text: 'No data', value: 1 }]);
    } catch (err) {
      // Optionally show error to user
      console.error('Failed to fetch analytics data', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, metricType, author]);

  return (
    <>
      <LoaderOverlay open={loading} />
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <div className="hackhawks-header">
            <img src="/hackhawks1.webp" alt="HackHawks Logo" className="hackhawks-logo" />
            <div className="hackhawks-title">HackHawks</div>
          </div>
          <div className="hackhawks-toolbar">
            <DateSelector
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
            <FetchButton
              onClick={fetchData}
              loading={loading}
              disabled={!startDate || !endDate}
            />
          </div>
          <Box mb={4}>
            <HighDeviationCommitsTable
              data={data}
              loading={loading}
              page={page}
              pageSize={pageSize}
              rowCount={rowCount}
              onPageChange={handlePageChange}
            />
          </Box>
          <Box mb={4}>
            <TimelineChart
              data={timelineData}
              metricType={metricType}
              author={author}
              onMetricTypeChange={setMetricType}
              onAuthorChange={setAuthor}
              authors={authors}
            />
          </Box>
          <Box mb={2}>
            <WordCloudChart
              data={wordCloudData}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default App;
