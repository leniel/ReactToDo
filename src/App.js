import React from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { ThemeProvider } from '@material-ui/core/styles';
import { GlobalLoader } from './components/AxiosInterceptor'
import theme from './theme'

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

                    <Main />

                    <Footer />

                </div>

            </ThemeProvider>

        )
    }
}

export default App;