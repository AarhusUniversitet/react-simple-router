import React from 'react';
import {
  RouterProvider,
  Route,
  Link,
  NavLink,
  Switch,
  useParams
} from './SimpleRouter';

// Interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  featured: boolean;
}

// Demo Page Components
const HomePage = () => {
  return (
    <div>
      <h1>Velkommen til SimpleRouter</h1>
      <p>Dette er en demo af vores egen simple router implementering for React 19.</p>
      <p>Prøv at navigere rundt ved hjælp af menuerne ovenfor.</p>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Features i denne router:</h2>
        <ul>
          <li>Enkel API inspireret af React Router</li>
          <li>Support for URL parametre</li>
          <li>NavLink med aktiv tilstand</li>
          <li>Route gruppering</li>
          <li>React 19 ready med use() hook support</li>
        </ul>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div>
      <h1>Om SimpleRouter</h1>
      <p>SimpleRouter er et letvægtigt routing-bibliotek til React, der giver dig de mest nødvendige routing-funktioner uden afhængighed af eksterne biblioteker.</p>

      <h2>Hvorfor SimpleRouter?</h2>
      <p>React Router og andre routing-biblioteker er fantastiske, men nogle gange har du brug for noget enklere og mere gennemsigtigt. SimpleRouter giver dig:</p>

      <ul>
        <li>Mindre bundlestørrelse</li>
        <li>Gennemskuelig kodebase (læs og forstå hele routeren)</li>
        <li>Ingen afhængigheder</li>
        <li>Fuldt TypeScript support</li>
      </ul>
    </div>
  );
};

// Produktkomponenter
const ProductCard = ({ product, showDetails = false }: { product: Product, showDetails?: boolean }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      background: product.featured ? '#fffbeb' : 'white',
      boxShadow: product.featured ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
    }}>
      <h3>{product.name} {product.featured && '⭐'}</h3>
      <p>{product.description}</p>
      <p><strong>Pris: {product.price} kr.</strong></p>

      {!showDetails && (
        <Link
          to={`/products/${product.id}`}
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: '#0762e5',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          Se detaljer
        </Link>
      )}

      {showDetails && (
        <Link
          to="/products"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: '#f0f0f0',
            color: '#333',
            borderRadius: '4px',
            textDecoration: 'none',
            marginTop: '1rem'
          }}
        >
          ← Tilbage til produkter
        </Link>
      )}
    </div>
  );
};

const ProductsPage = () => {
  // Sample produktdata
  const products: Product[] = [
    {
      id: '1',
      name: 'SimpleRouter Basic',
      price: 0,
      description: 'Grundlæggende routing med minimal opsætning',
      featured: false
    },
    {
      id: '2',
      name: 'SimpleRouter Pro',
      price: 299,
      description: 'Avancerede routing features til professionelle projekter',
      featured: true
    },
    {
      id: '3',
      name: 'SimpleRouter Enterprise',
      price: 999,
      description: 'Komplet routing løsning med support og tilpasninger',
      featured: false
    },
  ];

  return (
    <div>
      <h1>Produkter</h1>
      <p>Udforsk vores udvalg af routing løsninger:</p>

      <div style={{ marginTop: '2rem' }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  // Brug useParams til at få id
  const { id } = useParams();

  // Sample produktdata
  const products: Product[] = [
    {
      id: '1',
      name: 'SimpleRouter Basic',
      price: 0,
      description: 'Grundlæggende routing med minimal opsætning. Perfekt til mindre projekter og prototyper. Inkluderer de mest nødvendige routing features.',
      featured: false
    },
    {
      id: '2',
      name: 'SimpleRouter Pro',
      price: 299,
      description: 'Avancerede routing features til professionelle projekter. Inkluderer route guards, nested routes, og avanceret matching.',
      featured: true
    },
    {
      id: '3',
      name: 'SimpleRouter Enterprise',
      price: 999,
      description: 'Komplet routing løsning med support og tilpasninger. Prioriteret support, on-demand tilpasninger, og enterprise-grade ydeevne.',
      featured: false
    },
  ];

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div>
        <h1>Produkt ikke fundet</h1>
        <p>Beklager, vi kunne ikke finde det produkt du leder efter.</p>
        <Link to="/products">Tilbage til produktoversigten</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Produktdetaljer</h1>
      <ProductCard product={product} showDetails={true} />

      <div style={{ marginTop: '2rem' }}>
        <h2>Tekniske specifikationer</h2>
        <ul>
          <li><strong>Bundle størrelse:</strong> {product.id === '1' ? '2KB' : product.id === '2' ? '4KB' : '8KB'}</li>
          <li><strong>Dependencies:</strong> {product.id === '1' ? 'Ingen' : product.id === '2' ? 'Minimal' : 'Optimeret'}</li>
          <li><strong>TypeScript support:</strong> Ja</li>
          <li><strong>React version:</strong> 18, 19+</li>
          <li><strong>Browser support:</strong> Alle moderne browsere</li>
        </ul>
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div>
      <h1>Kontakt os</h1>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form style={{ display: 'grid', gap: '1rem' }} onSubmit={(e) => { e.preventDefault(); alert('Formularen er sendt (demo)'); }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Navn</label>
            <input
              id="name"
              type="text"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>E-mail</label>
            <input
              id="email"
              type="email"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>Besked</label>
            <textarea
              id="message"
              rows={5}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            ></textarea>
          </div>

          <button type="submit" style={{ justifySelf: 'start' }}>Send besked</button>
        </form>
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', margin: '2rem 0', color: '#ff6b6b' }}>404</h1>
      <h2>Side ikke fundet</h2>
      <p>Beklager, vi kunne ikke finde den side, du leder efter.</p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: '#0762e5',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none',
          marginTop: '1rem'
        }}
      >
        Gå til forsiden
      </Link>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  return (
    <nav style={{ marginBottom: '2rem' }}>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0, gap: '1rem' }}>
        <li>
          <NavLink to="/" activeClassName="active" exact>Hjem</NavLink>
        </li>
        <li>
          <NavLink to="/about" activeClassName="active">Om</NavLink>
        </li>
        <li>
          <NavLink to="/products" activeClassName="active">Produkter</NavLink>
        </li>
        <li>
          <NavLink to="/contact" activeClassName="active">Kontakt</NavLink>
        </li>
      </ul>
    </nav>
  );
};

// Main App Component
const App = () => {
  return (
    <RouterProvider>
      <div className="app">
        <header>
          <h1 style={{ marginBottom: '0.5rem' }}>SimpleRouter Demo</h1>
          <Navigation />
        </header>

        <main>
          <Switch>
            {/* Base routes */}
            <Route path="/" exact>
              <HomePage />
            </Route>

            <Route path="/about">
              <AboutPage />
            </Route>

            {/* Product routes - direkte ruter uden RouteGroup for at eliminere potentielle problemer */}
            <Route path="/products" exact>
              <ProductsPage />
            </Route>

            <Route path="/products/:id">
              <ProductDetailPage />
            </Route>

            {/* Alternativt med RouteGroup hvis du stadig ønsker at bruge den */}
            {/*
    <RouteGroup prefix="/products">
      <Route path="/" exact>
        <ProductsPage />
      </Route>
      
      <Route path="/:id">
        <ProductDetailPage />
      </Route>
    </RouteGroup>
    */}

            <Route path="/contact">
              <ContactPage />
            </Route>

            {/* Catch-all 404 route */}
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </main>

        <footer style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
          <p>&copy; 2025 SimpleRouter Demo. Alle rettigheder forbeholdes.</p>
        </footer>
      </div>
    </RouterProvider>
  );
};

export default App;