import React from 'react';
import About from "./About";
import Home from "./Home"
import Todo from "./todo/Todo"

// We are going to use this route config in 2
// spots: once for the sidebar and once in the main
// content section. All routes are in the same
// order they would appear in a <Switch>.
export const routes = [
    {
        text: "Home",
        path: "/",
        icon: "home",
        exact: true,
        component: () => <Home />
    },
    {
        text: "Todos",
        path: "/todos",
        icon: "list",
        component: () => <Todo />
    },
    {
        text: "About",
        path: "/about",
        icon: "info",
        exact: true,
        component: () => <About />,
        children: []
    }
];