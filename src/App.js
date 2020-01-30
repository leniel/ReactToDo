import React from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    overrides: {
        MuiPaper: {
            root: {
                padding: 16,
                marginBottom: 16
            },
        },
    },
    test: {
        myClass:
        {
            padding: 10
        }
    }
});

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

                    <Header />

                    <Main />

                    <Footer />

                </div>

            </ThemeProvider>

        )
    }
}

export default App;