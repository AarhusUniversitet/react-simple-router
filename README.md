# SimpleRouter

En simpel og letforståelig router implementation til React uden eksterne frameworks som Next.js.

## Funktioner

- **Letvægt**: Minimal kodebase uden eksterne afhængigheder
- **TypeScript Support**: Fuldt ud typet for bedre udviklingsoplevelse
- **Nem at bruge**: Intuitiv API der minder om React Router
- **Parametre i URL**: Understøtter dynamiske ruter med parametre
- **Ingen genindlæsninger**: Klient-side routing uden side refreshes

## Installation

```bash
npm install simple-react-router
```

Eller hvis du bruger yarn:

```bash
yarn add simple-react-router
```

## Grundlæggende brug

```jsx
import React from 'react';
import { RouterProvider, Route, Link, Switch } from 'simple-react-router';

// Dine sidekomponenter
const Home = () => <h1>Hjem</h1>;
const About = () => <h1>Om os</h1>;
const NotFound = () => <h1>404 - Ikke fundet</h1>;
const UserProfile = ({ id }) => <h1>Bruger {id}</h1>;

function App() {
  return (
    <RouterProvider>
      <nav>
        <Link to="/">Hjem</Link>
        <Link to="/om">Om os</Link>
        <Link to="/bruger/123">Bruger 123</Link>
      </nav>

      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/om">
          <About />
        </Route>
        <Route path="/bruger/:id">
          {(params) => <UserProfile id={params.id} />}
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </RouterProvider>
  );
}
```

## API Reference

### `<RouterProvider>`

Hovedkomponenten der giver routing-funktionalitet til dine komponenter. Skal placeres øverst i dit komponenttræ.

```jsx
<RouterProvider>
  {/* Din app her */}
</RouterProvider>
```

### `useRouter()`

Hook til at få adgang til routing-funktioner i dine komponenter.

```jsx
const { currentPath, navigate } = useRouter();

// Naviger programmatisk
navigate('/om');
```

### `<Route>`

Renderer børn kun når den aktuelle URL matcher den angivne sti.

```jsx
// Simpel rute
<Route path="/om">
  <About />
</Route>

// Rute med parametre
<Route path="/bruger/:id">
  {(params) => <UserProfile id={params.id} />}
</Route>
```

### `<Link>`

Navigationselement til at navigere uden at genindlæse siden.

```jsx
<Link to="/om">Om os</Link>

// Med styling
<Link to="/kontakt" className="button" style={{ color: 'blue' }}>
  Kontakt os
</Link>
```

### `<Switch>`

Renderer kun den første matchende `<Route>`.

```jsx
<Switch>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/om">
    <About />
  </Route>
  <Route path="*">
    <NotFound />
  </Route>
</Switch>
```

## Udvikling

### Forudsætninger

- Node.js >= 14
- npm eller yarn

### Installation

```bash
# Klon repository
git clone https://github.com/username/simple-react-router.git
cd simple-react-router

# Installer afhængigheder
npm install
```

### Scripts

- `npm run test`: Kør tests
- `npm run build`: Byg biblioteket
- `npm run storybook`: Start Storybook for udvikling
- `npm run build-storybook`: Byg Storybook til statisk side

## License

MIT
