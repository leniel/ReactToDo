import About from "./About";
import Home from "./Home"
import Todo from "./todo/Todo"
import Profile from "./user/Profile"

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
        component: Home,
        drawer: true
    },
    {
        text: "Todos",
        path: "/todos",
        icon: "list",
        exact: true,
        protected: true,
        component: Todo,
        drawer: true
    },
    {
        text: "About",
        path: "/about",
        icon: "info",
        exact: true,
        component: About,
        drawer: true
    },
    {
        text: "Profile",
        path: "/profile",
        icon: "info",
        protected: true,
        component: Profile,
        drawer: false
    }
];