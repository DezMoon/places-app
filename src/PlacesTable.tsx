import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TextField,
  Paper,
  TableContainer,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import { Place } from "./usePlacesData";

type Order = "asc" | "desc";

interface PlacesTableProps {
  places: Place[];
  filter: string;
  setFilter: (filter: string) => void;
  onRowSelect: (place: Place) => void;
  selectedPlace: Place | null;
}

const ROW_HEIGHT = 60;

// Define column widths (adjust these as needed)
const columnWidths = {
  pid: "20%",
  name: "25%",
  city: "15%",
  region: "10%",
  postal_code: "10%",
  latitude: "10%",
  longitude: "10%",
};

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

    const listRef = useRef<FixedSizeList>(null);

    useEffect(() => {
      if (selectedPlace && sortedData && listRef.current) {
        const index = sortedData.findIndex(
          (place) => place.pid === selectedPlace.pid
        );
        if (index !== -1) {
          listRef.current.scrollToItem(index, "start");
        }
      }
    }, [selectedPlace, sortedData]);

    function compare<T>(a: T, b: T) {
      if (a === b) {
        return 0;
      }
      return a > b || a === null ? 1 : -1;
    }

    const Row = useCallback(
      ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const place = sortedData[index];
        if (!place) {
          return null;
        }
        return (
          <TableRow
            key={place.pid}
            onClick={() => onRowSelect(place)}
            style={style}
            sx={{
              background:
                selectedPlace?.pid === place.pid ? "#a5d6a7" : "white", // Slightly darker green
              cursor: "pointer",
              "& td": {
                padding: "8px 12px",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              //borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <TableCell style={{ width: columnWidths.pid }}>
              {place.pid}
            </TableCell>
            <TableCell style={{ width: columnWidths.name }}>
              {place.name}
            </TableCell>
            <TableCell style={{ width: columnWidths.city }}>
              {place.city}
            </TableCell>
            <TableCell style={{ width: columnWidths.region }}>
              {place.region}
            </TableCell>
            <TableCell style={{ width: columnWidths.postal_code }}>
              {place.postal_code}
            </TableCell>
            <TableCell style={{ width: columnWidths.latitude }}>
              {place.latitude}
            </TableCell>
            <TableCell style={{ width: columnWidths.longitude }}>
              {place.longitude}
            </TableCell>
          </TableRow>
        );
      },
      [sortedData, onRowSelect, selectedPlace]
    );

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
                <TableCell key="pid" style={{ width: columnWidths.pid }}>
                  <TableSortLabel
                    active={orderBy === "pid"}
                    direction={orderBy === "pid" ? order : "asc"}
                    onClick={handleRequestSort("pid")}
                  >
                    PID
                  </TableSortLabel>
                </TableCell>
                <TableCell key="name" style={{ width: columnWidths.name }}>
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={handleRequestSort("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell key="city" style={{ width: columnWidths.city }}>
                  <TableSortLabel
                    active={orderBy === "city"}
                    direction={orderBy === "city" ? order : "asc"}
                    onClick={handleRequestSort("city")}
                  >
                    City
                  </TableSortLabel>
                </TableCell>
                <TableCell key="region" style={{ width: columnWidths.region }}>
                  <TableSortLabel
                    active={orderBy === "region"}
                    direction={orderBy === "region" ? order : "asc"}
                    onClick={handleRequestSort("region")}
                  >
                    Region
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key="postal_code"
                  style={{ width: columnWidths.postal_code }}
                >
                  <TableSortLabel
                    active={orderBy === "postal_code"}
                    direction={orderBy === "postal_code" ? order : "asc"}
                    onClick={handleRequestSort("postal_code")}
                  >
                    Postal Code
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key="latitude"
                  style={{ width: columnWidths.latitude }}
                >
                  Latitude
                </TableCell>
                <TableCell
                  key="longitude"
                  style={{ width: columnWidths.longitude }}
                >
                  Longitude
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <FixedSizeList
            height={600 - 48 - 16}
            width="100%"
            itemCount={sortedData.length}
            itemSize={ROW_HEIGHT}
            ref={listRef}
          >
            {Row}
          </FixedSizeList>
        </TableContainer>
      </Paper>
    );
  }
);

export default PlacesTable;
