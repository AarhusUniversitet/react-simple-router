# react-simple-router

En letvægts router til React-applikationer med fokus på simplicitet, typesikkerhed og nul eksterne dependencies.

## Funktioner

- 🪶 **Letvægts**: Minimal kodebase uden eksterne dependencies
- 📐 **TypeScript**: Fuldt typesikker for en bedre udvikleroplevelse
- 🔄 **React 19 kompatibel**: Understøtter nyeste React features og hooks
- 🧩 **Modulær**: Brug kun de komponenter, du har brug for
- 🔍 **Transparent**: Lærerig og forståelig kodebase

## Installation

```bash
npm install react-simple-router
# eller
yarn add react-simple-router
# eller
pnpm add react-simple-router
```

## Grundlæggende brug

```tsx
import React from 'react';
import { RouterProvider, Route, Link, Switch } from 'react-simple-router';

const App = () => (
  <RouterProvider>
    <nav>
      <Link to="/">Hjem</Link>
      <Link to="/om">Om</Link>
    </nav>

    <Switch>
      <Route path="/" exact>
        <h1>Forside</h1>
      </Route>
      <Route path="/om">
        <h1>Om os</h1>
      </Route>
      <Route path="*">
        <h1>404 - Ikke fundet</h1>
      </Route>
    </Switch>
  </RouterProvider>
);
```

## Parameteriserede ruter

```tsx
<Route path="/bruger/:id">
  {(params) => <UserProfile id={params.id} />}
</Route>
```

## API Reference

### `<RouterProvider>`

Hovedkomponenten der initialiserer routing konteksten.

```tsx
<RouterProvider>
  {/* Din app her */}
</RouterProvider>
```

### `<Route>`

Renderer indhold kun når den nuværende URL matcher en specifik sti.

```tsx
<Route path="/sti" exact={true}>
  {/* Indhold der vises når stien matcher */}
</Route>
```

### `<Link>` og `<NavLink>`

Navigationskomponenter der ikke genindlæser siden.

```tsx
<Link to="/sti">Naviger her</Link>
<NavLink to="/sti" activeClassName="active">Naviger her</NavLink>
```

### `<Switch>`

Renderer kun den første matchende Route.

```tsx
<Switch>
  <Route path="/a">A</Route>
  <Route path="/b">B</Route>
</Switch>
```

### `useRouter()`

Hook der giver adgang til router-konteksten.

```tsx
const { currentPath, navigate } = useRouter();
navigate('/ny-sti');
```

### `useParams()`

Hook der giver adgang til URL-parametre i den nuværende rute.

```tsx
const { id } = useParams();
```

## License

MIT