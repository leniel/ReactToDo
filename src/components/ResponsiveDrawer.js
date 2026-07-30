import React from 'react'
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import logo from '../logo.svg';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, Route, withRouter } from "react-router-dom";
import { routes } from './routes'
import Icon from '@mui/material/Icon'
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import { useAuth0 } from '../auth/Auth';
import config from "../auth/auth_config.json";

const PREFIX = 'PersistentDrawerLeft';

const classes = {
    root: `${PREFIX}-root`,
    appBar: `${PREFIX}-appBar`,
    appBarShift: `${PREFIX}-appBarShift`,
    menuButton: `${PREFIX}-menuButton`,
    hide: `${PREFIX}-hide`,
    drawer: `${PREFIX}-drawer`,
    drawerPaper: `${PREFIX}-drawerPaper`,
    drawerHeader: `${PREFIX}-drawerHeader`,
    content: `${PREFIX}-content`,
    contentShift: `${PREFIX}-contentShift`,
    large: `${PREFIX}-large`,
    login: `${PREFIX}-login`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
        // display: 'flex',
    },

    [`& .${classes.appBar}`]: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    [`& .${classes.appBarShift}`]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    [`& .${classes.menuButton}`]: {
        marginRight: theme.spacing(2),
    },

    [`& .${classes.hide}`]: {
        display: 'none',
    },

    [`& .${classes.drawer}`]: {
        width: drawerWidth,
        flexShrink: 0,
    },

    [`& .${classes.drawerPaper}`]: {
        width: drawerWidth,
    },

    [`& .${classes.drawerHeader}`]: {
        // display: 'flex',
        // alignItems: 'center',
        // padding: theme.spacing(0, 1),
        // ...theme.mixins.toolbar,
        // justifyContent: 'flex-end',
    },

    [`& .${classes.content}`]: {
        // flexGrow: 1,
        // padding: theme.spacing(3),
        // transition: theme.transitions.create('margin', {
        //     easing: theme.transitions.easing.sharp,
        //     duration: theme.transitions.duration.leavingScreen,
        // }),
        // marginLeft: -drawerWidth,
    },

    [`& .${classes.contentShift}`]: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },

    [`& .${classes.large}`]: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    },

    [`& .${classes.login}`]: {
        fontSize: 16
    }
}));

const drawerWidth = 200;

function PersistentDrawerLeft(props)
{

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
        <Root className={classes.root}>
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
                        size="large">
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
                            size="large">
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
                                    {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
                                    <MenuItem
                                        onClick={handleClose}
                                        component={Link}
                                        to={'/profile'}>Profile</MenuItem>
                                    <MenuItem onClick={() => logout(
                                        {
                                            returnTo: config.logoutRedirect
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
                    <IconButton onClick={handleDrawerClose} size="large">
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {routes.map((route, index) =>
                    {
                        if (route.drawer)
                        {
                            return (
                                <ListItem button
                                    key={route.text}
                                    component={Link}
                                    to={route.path}
                                    onClick={handleDrawerClose}>
                                    <Icon>{route.icon}</Icon>
                                    <ListItemText primary={route.text} style={{ marginLeft: "7px" }} />
                                </ListItem>)
                        }
                    })}
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
        </Root>
    );
}

export default PersistentDrawerLeft