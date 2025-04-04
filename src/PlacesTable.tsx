import React, { useState, useMemo, useRef, useEffect } from "react";
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
} from "@mui/material";
import { Place } from "./usePlacesData";

// Define the type for the sorting order
type Order = "asc" | "desc";

interface PlacesTableProps {
  places: Place[];
  filter: string;
  setFilter: (filter: string) => void;
  onRowSelect: (place: Place) => void;
  selectedPlace: Place | null;
}

const PlacesTable: React.FC<PlacesTableProps> = React.memo(
  ({ places, filter, setFilter, onRowSelect, selectedPlace }) => {
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof Place>("name");

    const handleRequestSort =
      (property: keyof Place) => (event: React.MouseEvent<unknown>) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
      };

    const filteredData = useMemo(() => {
      return places.filter((place) =>
        Object.values(place).some((value) =>
          String(value).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }, [places, filter]);

    const sortedData = useMemo(() => {
      const stabilizedThis = filteredData.map(
        (el, index) => [el, index] as [Place, number]
      );
      stabilizedThis.sort((a, b) => {
        const orderResult = compare(a[0][orderBy], b[0][orderBy]);
        if (orderResult !== 0) {
          return orderResult * (order === "desc" ? -1 : 1);
        }
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }, [filteredData, order, orderBy]);

    const tableBodyRef = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
      if (selectedPlace && tableBodyRef.current && sortedData) {
        const index = sortedData.findIndex(
          (place) => place.pid === selectedPlace.pid
        );
        if (index !== -1 && tableBodyRef.current.children[index]) {
          (
            tableBodyRef.current.children[index] as HTMLTableRowElement
          ).scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        }
      }
    }, [selectedPlace, sortedData]);

    function compare<T>(a: T, b: T) {
      if (a === b) {
        return 0;
      }
      return a > b || a === null ? 1 : -1;
    }

    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TextField
          label="Filter places"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell key="pid">
                  <TableSortLabel
                    active={orderBy === "pid"}
                    direction={orderBy === "pid" ? order : "asc"}
                    onClick={handleRequestSort("pid")}
                  >
                    PID
                  </TableSortLabel>
                </TableCell>
                <TableCell key="name">
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={handleRequestSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell key="city">
                  <TableSortLabel
                    active={orderBy === "city"}
                    direction={orderBy === "city" ? order : "asc"}
                    onClick={handleRequestSort("city")}
                  >
                    City
                  </TableSortLabel>
                </TableCell>
                <TableCell key="region">
                  <TableSortLabel
                    active={orderBy === "region"}
                    direction={orderBy === "region" ? order : "asc"}
                    onClick={handleRequestSort("region")}
                  >
                    Region
                  </TableSortLabel>
                </TableCell>
                <TableCell key="postal_code">
                  <TableSortLabel
                    active={orderBy === "postal_code"}
                    direction={orderBy === "postal_code" ? order : "asc"}
                    onClick={handleRequestSort("postal_code")}
                  >
                    Postal Code
                  </TableSortLabel>
                </TableCell>
                <TableCell key="latitude">Latitude</TableCell>
                <TableCell key="longitude">Longitude</TableCell>
              </TableRow>
            </TableHead>
            <TableBody ref={tableBodyRef}>
              {sortedData.map((place) => (
                <TableRow
                  key={place.pid}
                  onClick={() => onRowSelect(place)}
                  sx={{
                    background:
                      selectedPlace?.pid === place.pid ? "#c8e6c9" : "white",
                    cursor: "pointer",
                  }}
                >
                  <TableCell>{place.pid}</TableCell>
                  <TableCell>{place.name}</TableCell>
                  <TableCell>{place.city}</TableCell>
                  <TableCell>{place.region}</TableCell>
                  <TableCell>{place.postal_code}</TableCell>
                  <TableCell>{place.latitude}</TableCell>
                  <TableCell>{place.longitude}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
);

export default PlacesTable;
