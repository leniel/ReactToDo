import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './auth/Auth';
import config from "./auth/auth_config.json";
import history from "./utils/history";

// A function that routes the user to the right place after login
const onRedirectCallback = appState =>
{
    history.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={config.callbackUrl}
        onRedirectCallback={onRedirectCallback}
        response_type={config.responseType}
        audience={config.audience}
        scope={config.scope}>
        <App />
    </Auth0Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// HMR
if (module.hot)
{
    module.hot.accept();
}