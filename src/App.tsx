// App.tsx
import React from 'react';
import { 
  RouterProvider, 
  Route, 
  Link, 
  NavLink, 
  Switch, 
  RouteGroup,
  useRouter,
  useParams
} from './SimpleRouter';

// Interface definitioner
interface Product {
  id: string;
  name: string;
  featured: boolean;
}

interface ConditionalNavigationProps {
  showAdmin?: boolean;
}

interface DynamicLinksProps {
  items: Product[];
}

// Komponent med params
const UserProfile: React.FC = () => {
  // Nye React 19 måde at få params på
  const { id } = useParams();
  
  return (
    <div>
      <h2>Bruger Profil</h2>
      <p>ID: {id}</p>
    </div>
  );
};

// Komponent der bruger use() i betingede sammenhænge
const ConditionalNavigation: React.FC<ConditionalNavigationProps> = ({ showAdmin = false }) => {
  // Vi kan direkte bruge use() her i stedet for useRouter
  // og endda bruge det i betingelser
  return (
    <div>
      <p>Navigation:</p>
      <NavLink to="/" activeClassName="active" exact>Hjem</NavLink>
      {" | "}
      <NavLink to="/about" activeClassName="active">Om</NavLink>
      {" | "}
      <NavLink to="/users" activeClassName="active">Brugere</NavLink>
      
      {showAdmin && (
        <>
          {" | "}
          <NavLink 
            to="/admin" 
            activeClassName="active"
            activeStyle={{ fontWeight: 'bold', color: 'red' }}
          >
            Admin
          </NavLink>
        </>
      )}
    </div>
  );
};

// Komponent der viser dynamisk genererede links
const DynamicLinks: React.FC<DynamicLinksProps> = ({ items }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {/* Vi kan bruge use() direkte i loops, hvilket er nyt i React 19 */}
          <Link 
            to={`/product/${item.id}`}
            activeClassName={item.featured ? 'featured' : 'active'}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

// Produkt detalje komponent
interface ProductDetailProps {
  id: string;
  products: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id, products }) => {
  const product = products.find(p => p.id === id);
  
  return (
    <div>
      <h2>Produkt Detaljer</h2>
      <p>Produkt ID: {id}</p>
      <p>Produkt navn: {product?.name || 'Ukendt produkt'}</p>
      <Link to="/">Tilbage til forsiden</Link>
    </div>
  );
};

// Hovedapplikation
const App: React.FC = () => {
  // Nogle eksempel data
  const products: Product[] = [
    { id: '1', name: 'Produkt 1', featured: true },
    { id: '2', name: 'Produkt 2', featured: false },
    { id: '3', name: 'Produkt 3', featured: false },
  ];

  return (
    <RouterProvider>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>SimpleRouter Demo</h1>
        
        <ConditionalNavigation showAdmin={true} />
        
        <hr />
        
        <Switch>
          {/* Basis routes */}
          <Route path="/" exact>
            <div>
              <h2>Velkommen</h2>
              <p>Dette er forsiden.</p>
              <h3>Produkter</h3>
              <DynamicLinks items={products} />
            </div>
          </Route>
          
          <Route path="/about">
            <div>
              <h2>Om os</h2>
              <p>Dette er about-siden.</p>
            </div>
          </Route>
          
          {/* Grupperede routes med fælles prefix */}
          <RouteGroup prefix="/users">
            <Route path="/" exact>
              <div>
                <h2>Brugerliste</h2>
                <ul>
                  <li><Link to="/users/1">Bruger 1</Link></li>
                  <li><Link to="/users/2">Bruger 2</Link></li>
                  <li><Link to="/users/3">Bruger 3</Link></li>
                </ul>
              </div>
            </Route>
            
            <Route path="/:id">
              <UserProfile />
            </Route>
          </RouteGroup>
          
          {/* Produkt detalje route */}
          <Route path="/product/:id">
            {(params) => (
              <ProductDetail id={params.id} products={products} />
            )}
          </Route>
          
          {/* Admin section */}
          <Route path="/admin">
            <div>
              <h2>Admin Dashboard</h2>
              <p>Dette er et beskyttet område.</p>
            </div>
          </Route>
          
          {/* Catch-all 404 route */}
          <Route path="*">
            <div>
              <h2>404 - Siden blev ikke fundet</h2>
              <p>Beklager, vi kunne ikke finde den side, du leder efter.</p>
              <Link to="/">Gå til forsiden</Link>
            </div>
          </Route>
        </Switch>
        
        <hr />
        
        <footer>
          <p>SimpleRouter Demo &copy; 2025</p>
        </footer>
      </div>
    </RouterProvider>
  );
};

export default App;