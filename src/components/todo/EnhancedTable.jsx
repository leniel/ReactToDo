import React from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { lighten, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { format } from 'date-fns';
import { priority } from '../constants';
import EditIcon from '@mui/icons-material/Edit';
import { getTodoDueStatus } from './todoUtils';

const PREFIX = 'EnhancedTable';

const classes = {
    root: `${PREFIX}-root`,
    highlight: `${PREFIX}-highlight`,
    title: `${PREFIX}-title`,
    multilineColor: `${PREFIX}-multilineColor`,
    visuallyHidden: `${PREFIX}-visuallyHidden`
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        alignItems: "center",
        justifyContent: "space-between"
    },
    [`& .${classes.highlight}`]: theme.palette.mode === 'light'
        ? {
            color: theme.palette.primary.main,
            backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.dark,
        },
    [`& .${classes.title}`]: {},
    [`& .${classes.multilineColor}`]: {
        color: theme.palette.primary.light,
        paddingLeft: 10,
        width: 300,
        alignItems: "center"
    },
    [`& .${classes.visuallyHidden}`]: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px'
    }
}));

function desc(a, b, orderBy)
{
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function stableSort(array, cmp)
{
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) =>
    {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy)
{
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
    { id: 'name', string: true, disablePadding: false, align: 'left', label: 'Todo' },
    { id: 'category', numeric: false, disablePadding: false, align: 'center', label: 'Category' },
    { id: 'dueDate', numeric: false, disablePadding: true, align: 'center', label: 'Due date' },
    { id: 'priority', numeric: true, disablePadding: false, align: 'right', label: 'Priority' },
    { id: 'completed', numeric: false, disablePadding: false, align: 'center', label: 'Status' },
    { id: 'edit', numeric: false, disablePadding: true, align: 'right', label: '' },
];

function EnhancedTableHead(props)
{
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    
    const createSortHandler = property => event =>
    {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        slotProps={{ input: { 'aria-label': 'select all todos' } }}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const EnhancedTableToolbar = props =>
{
    let { numSelected, selected, setSelected, requestDelete, completeTodo, searchTodo } = props;

    return (
        <Toolbar sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
                bgcolor: (theme) => lighten(theme.palette.primary.light, 0.85),
            }),
        }}>
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Todos
                </Typography>
            )}
            {numSelected > 0 ? (
                <>
                    <Tooltip title="Complete">
                        <IconButton
                            aria-label="completed"
                            onClick={() =>
                            {
                                completeTodo(selected);
                                setSelected([]);
                            }}
                            size="large">
                            <CheckIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            aria-label="delete"
                            onClick={() =>
                            {
                                requestDelete(selected);
                                setSelected([]);
                            }}
                            size="large">
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <TextField
                    type="search"
                    label="Search todo"
                    color="primary"
                    onChange={(i) => { searchTodo(i.target.value); }}
                    slotProps={{
                        input: {
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                            )
                        }
                    }}
                />
            )}
        </Toolbar>
    );
};

function EnhancedTable(props)
{
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(true);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) =>
    {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event =>
    {
        if (event.target.checked)
        {
            const newSelected = props.todos.map(n => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) =>
    {        
        props.loadTodo(null);
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1)
        {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0)
        {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1)
        {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0)
        {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) =>
    {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event =>
    {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event =>
    {
        setDense(event.target.checked);
    };

    React.useEffect(() => {
        setSelected([]);
        setPage(0);
    }, [props.statusFilter, props.categoryFilter, props.searchFilter]);

    React.useEffect(() => {
        const lastPage = Math.max(0, Math.ceil(props.todos.length / rowsPerPage) - 1);
        setPage(currentPage => Math.min(currentPage, lastPage));
    }, [props.todos.length, rowsPerPage]);

    const isSelected = id => selected.indexOf(id) !== -1;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.todos.length - page * rowsPerPage);

    const handleEdit = (e, id) =>
    {
        e.stopPropagation();
        props.loadTodo(id);
    };
    
    return (
        <Root className={classes.root}>
            <Paper>
                <Tabs
                    value={props.statusFilter}
                    onChange={(_, value) => props.onStatusFilterChange(value)}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="Filter todos by status"
                >
                    {[
                        ['all', 'All'],
                        ['active', 'Active'],
                        ['completed', 'Completed'],
                        ['overdue', 'Overdue'],
                        ['dueSoon', 'Due soon'],
                    ].map(([value, label]) => (
                        <Tab key={value} value={value} label={`${label} (${props.statusCounts[value]})`} />
                    ))}
                </Tabs>
                <Stack direction="row" justifyContent="flex-end" sx={{ px: 2, py: 1 }}>
                    <TextField
                        select
                        size="small"
                        label="Category"
                        value={props.categoryFilter}
                        onChange={event => props.onCategoryFilterChange(event.target.value)}
                        sx={{ minWidth: 170 }}
                    >
                        <MenuItem value="">All categories</MenuItem>
                        {props.categories.map(category => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                        <MenuItem value="__uncategorized">No category</MenuItem>
                    </TextField>
                </Stack>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    selected={selected}
                    requestDelete={props.requestDelete}
                    completeTodo={props.completeTodo}
                    searchTodo={props.searchTodo}
                    setSelected={setSelected}
                    theme={props.theme}/>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                        stickyHeader
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={props.todos.length}
                        />
                        <TableBody>
                            {stableSort(props.todos, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) =>
                                {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => handleClick(event, row.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            selected={isItemSelected}
                                            key={row.id}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    slotProps={{ input: { 'aria-labelledby': labelId } }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                sx={{ overflowWrap: 'anywhere' }}>
                                                <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                                                {row.description && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'pre-wrap' }}>
                                                        {row.description}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.category
                                                    ? <Chip label={row.category} size="small" variant="outlined" />
                                                    : <Typography variant="body2" color="text.secondary">—</Typography>}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack alignItems="flex-end" spacing={0.5}>
                                                    <Typography variant="body2">
                                                        {row.dueDate && !Number.isNaN(new Date(row.dueDate).getTime())
                                                            ? format(new Date(row.dueDate), 'MM/dd/yyyy h:mm a')
                                                            : 'No date'}
                                                    </Typography>
                                                    {getTodoDueStatus(row) === 'overdue' && <Chip label="Overdue" color="error" size="small" />}
                                                    {getTodoDueStatus(row) === 'today' && <Chip label="Due today" color="warning" size="small" />}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">{priority.map(p => p.value === row.priority ? p.label : null)}</TableCell>
                                            <TableCell align="center">
                                                <Chip label={row.completed ? 'Completed' : 'Active'} color={row.completed ? 'success' : 'default'} size="small" variant={row.completed ? 'filled' : 'outlined'} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <span>
                                                        <IconButton aria-label="edit" onClick={e => handleEdit(e, row.id)} size="large" disabled={row.completed}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={7} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { value: props.todos.length, label: 'All' }]}
                    component="div"
                    count={props.todos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense"
                />
            </Paper>
        </Root>
    );
}

function TablePaginationActions(props)
{
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = event =>
    {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = event =>
    {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = event =>
    {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = event =>
    {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div style={{ flexShrink: 0, marginLeft: theme.spacing(2.5) }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
                size="large">
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                size="large">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                size="large">
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
                size="large">
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

export default EnhancedTable;
