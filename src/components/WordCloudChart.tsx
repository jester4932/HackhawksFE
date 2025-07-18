import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Wordcloud } from '@visx/wordcloud';

export interface WordCloudDatum {
  text: string;
  value: number;
}

interface WordCloudChartProps {
  data: WordCloudDatum[];
}

const colors = ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2'];

const WordCloudChart: React.FC<WordCloudChartProps> = ({ data }) => {
  // Color scale fallback
  const getColor = (i: number) => colors[i % colors.length];

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Commit Message Word Cloud
        </Typography>
        <Box width="100%" height={350}>
          <Wordcloud
            words={data}
            width={600}
            height={350}
            fontSize={w => 10 + (w as WordCloudDatum).value * 2}
            font={"Arial"}
            spiral="archimedean"
            padding={2}
            rotate={w => (Math.random() > 0.5 ? 0 : 90)}
          >
            {(cloudWords) =>
              cloudWords.map((word, i) => (
                <text
                  key={word.text}
                  textAnchor="middle"
                  transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                  fontSize={word.size}
                  fontFamily="Arial"
                  fill={getColor(i)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  {word.text}
                </text>
              ))
            }
          </Wordcloud>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WordCloudChart; 