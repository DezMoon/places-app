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
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import { Place } from "./usePlacesData";
import { Settings as SettingsIcon } from "@mui/icons-material";

type Order = "asc" | "desc";

interface PlacesTableProps {
  places: Place[];
  filter: string;
  setFilter: (filter: string) => void;
  onRowSelect: (place: Place) => void;
  selectedPlace: Place | null;
}

// Define column configuration
const columnsConfig: {
  key: keyof typeof columnWidths;
  label: string;
  visible: boolean;
}[] = [
  { key: "pid", label: "PID", visible: true },
  { key: "name", label: "Name", visible: true },
  { key: "city", label: "City", visible: true },
  { key: "region", label: "Region", visible: true },
  { key: "postal_code", label: "Postal Code", visible: true },
  { key: "latitude", label: "Latitude", visible: true },
  { key: "longitude", label: "Longitude", visible: true },
];

const ROW_HEIGHT = 56;

const columnWidths = {
  pid: "20%",
  name: "25%",
  city: "15%",
  region: "10%",
  postal_code: "10%",
  latitude: "10%",
  longitude: "10%",
};

const LOCAL_STORAGE_COLUMN_VISIBILITY_KEY = "placesTableColumnVisibility";

const PlacesTable: React.FC<PlacesTableProps> = React.memo(
  ({ places, filter, setFilter, onRowSelect, selectedPlace }) => {
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof Place>("name");
    const [visibleColumns, setVisibleColumns] = useState(() => {
      const storedVisibility = localStorage.getItem(
        LOCAL_STORAGE_COLUMN_VISIBILITY_KEY
      );
      if (storedVisibility) {
        return JSON.parse(storedVisibility);
      }
      return columnsConfig.filter((col) => col.visible).map((col) => col.key);
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
      localStorage.setItem(
        LOCAL_STORAGE_COLUMN_VISIBILITY_KEY,
        JSON.stringify(visibleColumns)
      );
    }, [visibleColumns]);

    const handleRequestSort =
      (property: keyof Place) => (event: React.MouseEvent<unknown>) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
      };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleColumnVisibilityToggle = (key: string) => {
      setVisibleColumns((prev: string[]) =>
        prev.includes(key)
          ? prev.filter((k: string) => k !== key)
          : [...prev, key]
      );
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
                selectedPlace?.pid === place.pid ? "#a5d6a7" : "white",
              cursor: "pointer",
              "& td": {
                padding: "8px 12px",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {columnsConfig.map((col) =>
              col.visible && visibleColumns.includes(col.key) ? (
                <TableCell
                  key={`${place.pid}-${col.key}`}
                  style={{ width: columnWidths[col.key] }}
                >
                  {place[col.key]}
                </TableCell>
              ) : null
            )}
          </TableRow>
        );
      },
      [sortedData, onRowSelect, selectedPlace, visibleColumns]
    );

    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TextField
          label="Filter places"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 1 }}
        />
        {filter.length > 0 && (
          <Button size="small" onClick={() => setFilter("")} sx={{ mb: 2 }}>
            Reset Filter
          </Button>
        )}

        <IconButton
          aria-label="column visibility"
          onClick={handleMenuOpen}
          sx={{ position: "absolute", top: 8, right: 8, color: "primary.main" }}
        >
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {columnsConfig.map((col) => (
            <MenuItem
              key={col.key}
              onClick={() => handleColumnVisibilityToggle(col.key)}
            >
              <Checkbox checked={visibleColumns.includes(col.key)} />
              <ListItemText primary={col.label} />
            </MenuItem>
          ))}
        </Menu>

        {sortedData.length === 0 && filter.length > 0 && (
          <Typography variant="subtitle1" color="textSecondary" sx={{ p: 2 }}>
            No places found matching your filter: "{filter}"
          </Typography>
        )}

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columnsConfig.map((col) =>
                  col.visible && visibleColumns.includes(col.key) ? (
                    <TableCell
                      key={col.key}
                      style={{ width: columnWidths[col.key] }}
                    >
                      <TableSortLabel
                        active={orderBy === col.key}
                        direction={orderBy === col.key ? order : "asc"}
                        onClick={handleRequestSort(col.key)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>
          </Table>
          {sortedData.length > 0 && (
            <FixedSizeList
              height={600 - 48 - 16}
              width="100%"
              itemCount={sortedData.length}
              itemSize={ROW_HEIGHT}
              ref={listRef}
            >
              {Row}
            </FixedSizeList>
          )}
        </TableContainer>
      </Paper>
    );
  }
);

export default PlacesTable;
