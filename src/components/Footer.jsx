import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

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
    const [buildInfo, setBuildInfo] = useState(null);

    useEffect(() => {
        fetch('/buildinfo.json', { cache: 'no-store' })
            .then(response => response.ok ? response.json() : null)
            .then(info => {
                if (info?.buildNumber && info?.commit) {
                    setBuildInfo(info);
                }
            })
            .catch(() => {
                // Build metadata is only present in CI deployments.
            });
    }, []);

    return (
        <Root className={classes.footer}>
            <Container
                maxWidth="md"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <Typography variant="body1">React To Do sample ReactJS application.</Typography>
                    <Copyright />
                </div>
                {buildInfo && (
                    <Tooltip
                        title={`Build ID: ${buildInfo.buildId}\nCommit: ${buildInfo.commit}`}
                        slotProps={{ tooltip: { sx: { whiteSpace: 'pre-line' } } }}
                    >
                        <Chip
                            size="small"
                            color="primary"
                            variant="outlined"
                            label={`Build ${buildInfo.buildNumber} · ${buildInfo.commit.slice(0, 7)}`}
                            aria-label={`Deployed build ${buildInfo.buildNumber}, commit ${buildInfo.commit}`}
                            sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
                        />
                    </Tooltip>
                )}
            </Container>
        </Root>
    );
}
