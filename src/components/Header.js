import React from 'react';
import logo from '../logo.svg';

function Header()
{
   const date = new Date();
   const hours = date.getHours();
   let timeOfDay;

   const styles = {
     fontSize: 24
   }

   if(hours < 12)
   {
     timeOfDay = "morning"
     styles.color = "yellow"
   }
   else if(hours >= 12 && hours < 17)
   {
     timeOfDay = "afternoon"
     styles.color = "green"
   }
   else
   {
     timeOfDay = "night"
     styles.color = "black"
   }

    return (
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://github.com/leniel/ReactToDo"
          target="_blank"
        > React To Do
        </a>

        <p style={styles}>Good {timeOfDay}</p>
      </header>
    )
}

export default Header;