import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

const PREFIX = 'Footer';

const classes = {
    root: `${PREFIX}-root`,
    main: `${PREFIX}-main`,
    footer: `${PREFIX}-footer`
};

const Root = styled('footer')((
    {
        theme
    }
) => ({
    [`& .${classes.root}`]: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },

    [`& .${classes.main}`]: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },

    [`&.${classes.footer}`]: {
        //color: 'white',
        padding: theme.spacing(3, 2),
        marginTop: '16px',
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300],
    }
}));

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

export default function StickyFooter()
{


    return (
        <Root className={classes.footer}>
            <Container maxWidth="sm">
                <Typography variant="body1">React To Do sample ReactJS application.</Typography>
            <Copyright
            />
            </Container>
        </Root>
    );
}