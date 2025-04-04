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

// Props interface for the PlacesTable component
interface PlacesTableProps {
  places: Place[]; // List of places to display
  filter: string; // Current filter value
  setFilter: (value: string) => void; // Function to update the filter value
  onRowSelect: (place: Place) => void; // Callback when a row is selected
  selectedPlace: Place | null; // Currently selected place
}

// Type for sorting order
type Order = 'asc' | 'desc';

const PlacesTable: React.FC<PlacesTableProps> = ({ places, filter, setFilter, onRowSelect, selectedPlace }) => {
  // State for sorting order and the column to sort by
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Place>('name');

  // Handles sorting logic when a column header is clicked
  const handleSort = (column: keyof Place) => {
    setOrder(orderBy === column && order === 'asc' ? 'desc' : 'asc'); // Toggle sorting order
    setOrderBy(column); // Set the column to sort by
  };

  // Filters the data based on the current filter value
  const filteredData = useMemo(() => {
    return places.filter((place) =>
      Object.values(place)
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase()) // Case-insensitive filtering
    );
  }, [places, filter]);

  // Sorts the filtered data based on the selected column and order
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      return aValue < bValue ? (order === 'asc' ? -1 : 1) : aValue > bValue ? (order === 'asc' ? 1 : -1) : 0;
    });
  }, [filteredData, order, orderBy]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Table container with a filter input */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <TextField
          label="Filter/Search"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Update filter value on input change
          sx={{ margin: 2 }}
        />
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {/* Render column headers with sorting functionality */}
              {['PID', 'Name', 'City', 'Region', 'Postal_Code', 'Tenant_Type'].map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={orderBy === col} // Highlight active column
                    direction={orderBy === col ? order : 'asc'} // Set sorting direction
                    onClick={() => handleSort(col as keyof Place)} // Handle column sorting
                  >
                    {col}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render rows for the sorted and filtered data */}
            {sortedData.map((place) => (
              <TableRow
                key={place.pid}
                onClick={() => onRowSelect(place)} // Handle row selection
                sx={{
                  background: selectedPlace?.pid === place.pid ? '#c8e6c9' : 'white', // Highlight selected row
                  cursor: 'pointer', // Change cursor to pointer for clickable rows
                }}
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