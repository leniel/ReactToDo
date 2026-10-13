import React from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAuth0 } from "../../auth/Auth";

const PREFIX = 'Profile';

const classes = {
    root: `${PREFIX}-root`
};

const StyledCard = styled(Card)({
    [`&.${classes.root}`]: {
        maxWidth: 500
    }
});

const Profile = () =>
{
    const { user } = useAuth0();



    return (
        <StyledCard className={classes.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Profile"
                    height="300"
                    image={user.picture}
                    title="Profile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {user.name} | {user.email}
          </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <code>{JSON.stringify(user, null, 2)}</code>
          </Typography>
                </CardContent>
            </CardActionArea>
            {/* <CardActions>
                <Button size="small" color="primary">
                    Share
        </Button>
                <Button size="small" color="primary">
                    Learn More
        </Button>
            </CardActions> */}
        </StyledCard>
    );
};

export default Profile