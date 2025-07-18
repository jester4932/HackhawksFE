import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Typography, Link, CircularProgress } from '@mui/material';
import type { CommitDeviation } from '../types/CommitDeviation';

interface HighDeviationCommitsTableProps {
  data: CommitDeviation[];
  loading: boolean;
  page: number;
  pageSize: number;
  rowCount: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const columns: GridColDef<CommitDeviation>[] = [
  {
    field: 'sha',
    headerName: 'SHA',
    minWidth: 120,
    flex: 1,
    renderCell: (params: GridRenderCellParams<CommitDeviation, string>) => (
      <Link href={`https://github.com/OpenRA/OpenRA/commit/${params.value}`} target="_blank" rel="noopener noreferrer" underline="hover">
        {params.value?.slice(0, 7)}
      </Link>
    ),
  },
  {
    field: 'title',
    headerName: 'Title',
    minWidth: 250,
    flex: 2,
  },
  {
    field: 'author',
    headerName: 'Author',
    minWidth: 120,
    flex: 1,
  },
  {
    field: 'date',
    headerName: 'Date',
    minWidth: 140,
    flex: 1,
    valueFormatter: (params: any) => new Date(params.value as string).toLocaleString(),
  },
  {
    field: 'totalChanges',
    headerName: 'Total Changes',
    minWidth: 120,
    flex: 1,
    type: 'number',
  },
];

const HighDeviationCommitsTable: React.FC<HighDeviationCommitsTableProps> = ({ data, loading, page, pageSize, rowCount, onPageChange }) => {
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        High Deviation Commits
      </Typography>
      <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.sha}
          loading={loading}
          pagination
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          rowCount={rowCount}
          onPaginationModelChange={(model: GridPaginationModel) => onPageChange(model.page, model.pageSize)}
          disableRowSelectionOnClick
          sx={{ backgroundColor: 'background.paper', borderRadius: 2 }}
        />
        {loading && (
          <Box position="absolute" top={0} left={0} width="100%" height="100%" display="flex" alignItems="center" justifyContent="center" bgcolor="rgba(255,255,255,0.7)" zIndex={1}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HighDeviationCommitsTable; 