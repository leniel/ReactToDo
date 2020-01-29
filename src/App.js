import React from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';

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
            <div className="App">

                <Header
                // loggedIn={this.state.isLoggedIn}
                />

                <Main />

                <Footer />

            </div>
        )
    }
}

export default App;