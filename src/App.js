import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { GlobalLoader } from './components/AxiosInterceptor'
import { theme } from './theme'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { routes } from './components/routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth0 } from './auth/Auth';
import PrivateRoute from './auth/PrivateRoute';
import { LinearProgress } from '@mui/material';

function App()
{
    const { loading } = useAuth0();

    if (loading) return <LinearProgress className="progress" />;

    return (
        <Router>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>

                    {/* Loading indicator */}
                    <GlobalLoader />

                    <div className="App">

                        <Header />

                        <ToastContainer />

                        <div className="main">

                            <Routes>
                                {routes.map((route, index) =>
                                {
                                    const Component = route.component;

                                    if (!route.protected)
                                        return <Route
                                            key={index}
                                            path={route.path}
                                            element={<Component />}
                                        />;
                                    
                                    return <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <PrivateRoute>
                                                <Component />
                                            </PrivateRoute>
                                        } 
                                    />;
                                })}
                            </Routes>

                        </div>

                        <Footer />

                    </div>

                </ThemeProvider>
            </StyledEngineProvider>
        </Router>
    );
}

export default App;