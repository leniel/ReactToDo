import React, { Fragment } from "react";
import { useAuth0 } from "../../auth/Auth";

const Profile = () =>
{
    const { user } = useAuth0();

    return (
        <Fragment>

            <img src={user.picture} alt="Profile" height="500" />

            <h2>{user.name}</h2>

            <p>{user.email}</p>
            
            <code>{JSON.stringify(user, null, 2)}</code>
        
        </Fragment>
    );
};

export default Profile