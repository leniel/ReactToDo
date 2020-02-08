import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from '@material-ui/core/styles';
import { GlobalLoader } from './components/AxiosInterceptor'
import { theme } from './theme'
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { routes } from './components/routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from './auth/Auth';
import PrivateRoute from './auth/PrivateRoute';
import { LinearProgress } from '@material-ui/core';

function App()
{
    const { loading } = useAuth0();

    if (loading)
    {
        return <LinearProgress className="progress" />;
    }

    return (
        <Router>

            <ThemeProvider theme={theme}>

                {/* Loading indicator */}
                <GlobalLoader />

                <div className="App">

                    <Header />

                    <ToastContainer />

                    <div className="main">

                        <Switch>
                            {routes.map((route, index) =>
                            {
                                if (!route.protected)
                                {
                                    return <Route
                                        key={index}
                                        path={route.path}
                                        exact={route.exact}
                                        component={route.component}
                                    />
                                }
                                else
                                {
                                    return <PrivateRoute
                                        key={index}
                                        path={route.path}
                                        exact={route.exact}
                                        component={route.component} />
                                }
                            })}

                            {/* <PrivateRoute
                            // key={index}
                            path="/todos"
                            exact
                            component={<Todo />} /> */}

                        </Switch>

                    </div>

                    <Footer />

                </div>

            </ThemeProvider>

        </Router>
    )
}

export default App;