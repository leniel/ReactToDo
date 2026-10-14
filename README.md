# React To Do

A React single page application with an ASP.NET Core API. Users sign in with Auth0; the API stores each user's todos in SQL Server.

## Main parts

- `src/index.jsx` starts React and configures the Auth0 provider.
- `src/App.jsx` sets up the shared layout, theme, and page routing.
- `src/components/routes.jsx` defines the pages. Route components load on demand, so the Todos page code is fetched when a user opens it.
- `src/components/todo/` contains task status filters, categories, notes, due-date shortcuts, and the sortable/searchable table.
- `src/service/TodoService.js` calls the API. `src/components/AxiosInterceptor.jsx` adds the Auth0 access token to API requests and displays request progress and errors.
- `TodoApi/` is the ASP.NET Core 10 API. Entity Framework Core maps `TodoContext` to SQL Server; migrations update the schema at startup, and Auth0 policies protect user actions.

## Technologies

| Technology | Purpose |
| --- | --- |
| React 19 and React Router 7 | User interface and client-side pages |
| Material UI 9 | Layout, controls, date picker, and visual theme |
| MUI X Date Pickers 9 | Todo due date and time selection |
| Auth0 SPA SDK | Browser sign-in and API access tokens |
| Vite 8 | Frontend development server and production build |
| Axios | HTTP requests from the browser to the API |
| Formik and Yup | Todo form state and validation |
| ASP.NET Core 10 | REST API and authentication/authorization |
| Entity Framework Core 10 and SQL Server | Database access and persistence |
| Vitest and Testing Library | Frontend component and behavior tests |

## Run locally

Start the API from the `TodoApi` directory:

```powershell
dotnet run --urls http://localhost:8888
```

Start the frontend from the repository root in a second terminal:

```powershell
npm install
npm run start
```

Open [http://localhost:3000](http://localhost:3000). The API's Swagger UI is at [http://localhost:8888](http://localhost:8888).

The API connection string is named `TodoDatabase` and is configured in the API's application settings. The frontend Auth0 settings are in `src/auth/auth_config.json`; the API's Auth0 authority and audience are configured in its application settings. Set `VITE_API_BASE_URL` in a local `.env` file to change the API host (the default is `http://localhost:8888`). Keep credentials and other private configuration out of source control.

## Tests and production build

```powershell
npm test
npm run test:watch
npm run build
```
