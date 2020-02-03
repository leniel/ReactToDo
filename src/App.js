import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from '@material-ui/core/styles';
import { GlobalLoader } from './components/AxiosInterceptor'
import { theme } from './theme'
import { Switch, Route } from "react-router-dom";
import { routes } from './components/routes'

class App extends React.Component
{
    constructor()
    {
        super()

        this.state = {
            isLoggedIn: "false"
        }
    }

    render()
    {
        return (

            <ThemeProvider theme={theme}>

                <div className="App">

                    {/* Loading indicator */}
                    <GlobalLoader />

                    <Header />

                    <div className="main">
                    <Switch>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                component={route.main}
                            />
                        ))}
                        </Switch>

                    </div>

                    <Footer />

                </div>

            </ThemeProvider>

        )
    }
}

export default App;