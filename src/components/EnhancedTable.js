import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import FilterListIcon from '@material-ui/icons/FilterList';
import moment from 'moment'
import { priority } from './constants'
import EditIcon from '@material-ui/icons/Edit';
import { withTheme } from '@material-ui/core/styles';

function desc(a, b, orderBy)
{
    if (b[orderBy] < a[orderBy])
    {
        return -1;
    }
    if (b[orderBy] > a[orderBy])
    {
        return 1;
    }
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
    { id: 'dueDate', numeric: false, disablePadding: true, align: 'center', label: 'Due date' },
    { id: 'priority', numeric: true, disablePadding: false, align: 'right', label: 'Priority' },
    { id: 'completed', numeric: false, disablePadding: false, align: 'right', label: 'Done' },
    { id: 'edit', numeric: false, disablePadding: true, align: 'right', label: '' },
];

function EnhancedTableHead(props)
{
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    
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
                        inputProps={{ 'aria-label': 'select all todos' }}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
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

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        alignItems: "center",
        justifyContent: "space-between"
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.primary.main,
                backgroundColor: lighten(theme.palette.primary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.primary.dark,
            },
    title: {
        // flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = props =>
{
    const classes = useToolbarStyles();
    let { numSelected, selected, setSelected, deleteTodo, completeTodo } = props;

    // console.log(selected)

    return (

        <Toolbar className={clsx(classes.root, {[classes.highlight]: numSelected > 0 })}>
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {numSelected} selected
        </Typography>
            ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle">
                        Todos
        </Typography>
                )}

            {numSelected > 0 ? (
                <>
                    <Tooltip title="Complete">
                        <IconButton aria-label="completed" onClick={() =>
                        {
                            props.completeTodo(selected)

                            setSelected([])
                        }}>
                            <CheckIcon />
                        </IconButton>
                    </Tooltip>
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() =>
                    {
                        props.deleteTodo(selected)

                        setSelected([])
                    }}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
                    </>
            ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
         alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        padding: "16px",
        marginBottom: theme.spacing(2),
        marginTop: 10,
        width: "100%"
    },
    table: {
        // width: "auto",
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

function EnhancedTable(props)
{
    const classes = useStyles();
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
        // When clicking the table disable editing
        props.loadTodo(null)

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

    const isSelected = id => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.todos.length - page * rowsPerPage);

    const handleEdit = (e, id) =>
    {
        e.stopPropagation()

        props.loadTodo(id)
    }
    
    return (
        
        <div className={classes.root}>

            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    selected={selected}
                    deleteTodo={props.deleteTodo}
                    completeTodo={props.completeTodo}
                    setSelected={setSelected}
                    theme={props.theme}/>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                        
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
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                style={{ width: '100%' }}>{row.name}
                                            </TableCell>
                                            <TableCell align="right">{moment(row.dueDate).format('MM/DD/YYYY h:mm a')}</TableCell>
                                            <TableCell align="right">{priority.map(p => p.value === row.priority ? p.label : null)}</TableCell>
                                            <TableCell align="right">{row.completed ? "Yep" : "Nope"}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit" disabled={row.completed && "disabled"}>
                                                    <IconButton aria-label="edit" onClick={e => handleEdit(e, row.id)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={props.todos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Dense"
                />
            </Paper>
        </div>
    );
}

export default withTheme(EnhancedTable);