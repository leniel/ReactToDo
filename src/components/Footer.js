import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright()
{
    return (
        <Typography variant="body2" color="textSecondary">
            {'Copyright © '}
            <Link color="inherit" href="https://leniel.net/" target="_blank">
                Leniel.net
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },
    footer: {
        //color: 'white',
        padding: theme.spacing(3, 2),
        marginTop: '16px',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300],
    },
}));

export default function StickyFooter()
{
    const classes = useStyles();

    return (
              <footer className={classes.footer}>
                <Container maxWidth="sm">
                    <Typography variant="body1">React To Do sample ReactJS application.</Typography>
                <Copyright
                />
                </Container>
            </footer>
    );
}