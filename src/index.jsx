import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from './auth/Auth';
import config from "./auth/auth_config.json";

// A function that routes the user to the right place after login
const onRedirectCallback = appState =>
{
    const targetUrl = appState && appState.targetUrl
        ? appState.targetUrl
        : "/";

    window.history.replaceState({}, document.title, targetUrl);
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Auth0Provider
        domain={config.domain}
        clientId={config.clientId}
        authorizationParams={{
            redirect_uri: config.callbackUrl,
            audience: config.audience,
            scope: config.scope
        }}
        onRedirectCallback={onRedirectCallback}
    >
        <App />
    </Auth0Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
