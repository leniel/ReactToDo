import React from 'react'
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import logo from '../logo.svg';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link, Route, withRouter }  from "react-router-dom";
import { routes } from './routes'
import Icon from '@material-ui/core/Icon'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import { useAuth0 } from '../auth/Auth';
import config from "../auth/auth_config.json";

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
    root: {
        // display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        // display: 'flex',
        // alignItems: 'center',
        // padding: theme.spacing(0, 1),
        // ...theme.mixins.toolbar,
        // justifyContent: 'flex-end',
    },
    content: {
        // flexGrow: 1,
        // padding: theme.spacing(3),
        // transition: theme.transitions.create('margin', {
        //     easing: theme.transitions.easing.sharp,
        //     duration: theme.transitions.duration.leavingScreen,
        // }),
        // marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    large: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    },
    login:
    {
        fontSize: 16
    }
}));

function PersistentDrawerLeft(props)
{
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    // useEffect(() =>
    // {
    //     const doSomething = async () =>
    //     {
    //         console.log(isAuthenticated);
    //     };
    //     if (!loading)
    //     {
    //         doSomething();
    //     }
    // }, [loading, alert('hey')]);

    const [anchorEl, setAnchorEl] = useState(null);
    
    const openMenu = Boolean(anchorEl);

    // const handleChange = event =>
    // {
    //     setAuth(event.target.checked);
    // };

    const handleMenu = event =>
    {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () =>
    {
        setAnchorEl(null);
    };

    const handleDrawerOpen = () =>
    {
        setOpen(true);
    };

    const handleDrawerClose = () =>
    {
        setOpen(false);
    };

    return (

        <div className={classes.root}>

{/* 
            {

                console.log(user) }
                    console.log(isAuthenticated)
        console.log(loginWithRedirect)
        console.log(logout)
            
        } */}

            <CssBaseline />
            <AppBar
                position="fixed"
                // className={clsx(classes.appBar, {
                //     [classes.appBarShift]: open,
                // })}
            >                
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src={logo} alt="logo" className="App-logo" />
                    <Typography variant="h6" style={{ flex: 1 }}>
                        React To Do
                </Typography >
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                            color="inherit"
                            className={classes.login}
                        >
                            {isAuthenticated ?
                                <>
                                <Avatar
                                    lt={user.name}
                                    src={user.picture}
                                        className={classes.large} />
                                    <span>&nbsp;&nbsp;</span>
                                    {user.name}
                                    </>
                            :
                                <AccountCircle className={classes.large} />

                                }
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={openMenu}
                                onClose={handleClose}
                        >
                            {isAuthenticated ?
                                <>
                                    <MenuItem onClick={handleClose}>My account</MenuItem>
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={() => logout(
                                        {
                                            returnTo:config.logoutRedirect
                                        }
                                    )}>Sign Out</MenuItem>
                                    </>
                                :
                                <MenuItem onClick={() => loginWithRedirect({})}>Sign In</MenuItem>}
                            </Menu>
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {routes.map((route, index) => (
                        <ListItem button
                            key={route.text}
                            component={Link}
                            to={route.path}
                            onClick={handleDrawerClose}>
                            <Icon>{route.icon}</Icon>
                            <ListItemText primary={route.text} style={{marginLeft: "7px"}} />
                        </ListItem>
                    ))}
                    {/* Callback route */}
                    {/* <Route exact path='/callback' component={Callback} /> */}
                </List>
                {/* <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List> */}
            </Drawer>

            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
            </main>

            </div>
    );
}

export default PersistentDrawerLeft