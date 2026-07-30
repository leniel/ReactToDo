import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "./Auth";

const PrivateRoute = ({ children }) =>
{
    const { loading, isAuthenticated, loginWithRedirect } = useAuth0();
    const location = useLocation();

    useEffect(() =>
    {
        if (loading || isAuthenticated) return;

        const fn = async () =>
        {
            await loginWithRedirect({
                appState: { targetUrl: location.pathname }
            });
        };

        fn();

    }, [loading, isAuthenticated, loginWithRedirect, location.pathname]);

    return isAuthenticated === true ? children : null;
};

export default PrivateRoute;