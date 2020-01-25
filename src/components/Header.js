import React, { Component } from 'react';
import logo from '../logo.svg';

class Header extends Component
{
  constructor()
  {
    super()
  }
  render()
  {
    const date = new Date();
    const hours = date.getHours();
    let timeOfDay;

    const styles = {
      fontSize: 24
    }

    if (hours < 12)
    {
      timeOfDay = "morning"
      styles.color = "yellow"
    }
    else if (hours >= 12 && hours < 17)
    {
      timeOfDay = "afternoon"
      styles.color = "green"
    }
    else
    {
      timeOfDay = "night"
      styles.color = "white"
    }

    return (

      <header className="App-header">

<nav class="navbar navbar-expand-md navbar-dark bg-dark">
  <a class="navbar-brand App-link"
                href="https://github.com/leniel/ReactToDo"
                target="_blank"
              >
                <img src={logo} className="App-logo" alt="logo" />
                React To Do
        </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarCollapse">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
     
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
      </li>
            </ul>
            

            <p className="welcome" style={styles}>Good {timeOfDay}</p>
            <p className="login-status">Logged In: {this.props.loggedIn}</p>
    {/* <form class="form-inline mt-2 mt-md-0">
      <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form> */}
  </div>
</nav>

        
             


      </header>
    )
  }
}

export default Header;