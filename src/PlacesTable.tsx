import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TextField,
  Paper,
  TableContainer,
} from '@mui/material';
import { Place } from './usePlacesData';

interface PlacesTableProps {
  places: Place[];
  filter: string;
  setFilter: (value: string) => void;
  onRowSelect: (place: Place) => void;
  selectedPlace: Place | null;
}

type Order = 'asc' | 'desc';

const PlacesTable: React.FC<PlacesTableProps> = ({ places, filter, setFilter, onRowSelect, selectedPlace }) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Place>('name');

  const handleSort = (column: keyof Place) => {
    setOrder(orderBy === column && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const filteredData = useMemo(() => {
    return places.filter((place) =>
      Object.values(place)
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase())
    );
  }, [places, filter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      return aValue < bValue ? (order === 'asc' ? -1 : 1) : aValue > bValue ? (order === 'asc' ? 1 : -1) : 0;
    });
  }, [filteredData, order, orderBy]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <TextField label="Filter" variant="outlined" fullWidth value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ margin: 2 }} />
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {['pid', 'name', 'city', 'region', 'postal_code', 'tenant_type'].map((col) => (
                <TableCell key={col}>
                  <TableSortLabel active={orderBy === col} direction={orderBy === col ? order : 'asc'} onClick={() => handleSort(col as keyof Place)}>
                    {col}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((place) => (
              <TableRow
                key={place.pid}
                onClick={() => onRowSelect(place)}
                sx={{ background: selectedPlace?.pid === place.pid ? '#c8e6c9' : 'white', cursor: 'pointer' }}
              >
                <TableCell>{place.pid}</TableCell>
                <TableCell>{place.name}</TableCell>
                <TableCell>{place.city}</TableCell>
                <TableCell>{place.region}</TableCell>
                <TableCell>{place.postal_code}</TableCell>
                <TableCell>{place.tenant_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlacesTable;