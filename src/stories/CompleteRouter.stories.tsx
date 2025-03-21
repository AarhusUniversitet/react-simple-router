import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RouterProvider, Route, Link, Switch, useRouter } from '../SimpleRouter';

// Demo Pages
const HomePage = () => (
  <div style={{ padding: '20px', background: 'white', borderRadius: '4px' }}>
    <h1>Forsiden</h1>
    <p>Velkommen til vores demo-applikation!</p>
    <p>Dette er en demonstration af en komplet SimpleRouter implementation med alle komponenter.</p>
  </div>
);

const AboutPage = () => (
  <div style={{ padding: '20px', background: 'white', borderRadius: '4px' }}>
    <h1>Om Os</h1>
    <p>Vi er et hypotetisk firma, der demonstrerer React-routing.</p>
    <p>Her er nogle fakta om os:</p>
    <ul>
      <li>Grundlagt i 2025</li>
      <li>Specialiseret i simpel routing</li>
      <li>Elsker React og TypeScript</li>
    </ul>
  </div>
);

const ProductsPage = () => {
  // Liste af produkter
  const products = [
    { id: 1, name: 'SimpleRouter Basic', price: 0, description: 'Gratis open-source routing.' },
    { id: 2, name: 'SimpleRouter Pro', price: 49, description: 'Avancerede routing funktioner.' },
    { id: 3, name: 'SimpleRouter Enterprise', price: 199, description: 'Full-scale routing med support.' },
  ];

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '4px' }}>
      <h1>Produkter</h1>
      <p>Udforsk vores udvalg af routing-løsninger:</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #e0e0e0', borderRadius: '4px', padding: '15px' }}>
            <h3>{product.name}</h3>
            <p style={{ color: '#666' }}>{product.description}</p>
            <p style={{ fontWeight: 'bold', color: product.price === 0 ? '#2ecc71' : '#3498db' }}>
              {product.price === 0 ? 'Gratis' : `${product.price} DKK`}
            </p>
            <Link 
              to={`/products/${product.id}`}
              style={{ 
                display: 'inline-block',
                padding: '8px 12px',
                background: '#3498db',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginTop: '10px'
              }}
            >
              Se Detaljer
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDetailsPage = ({ id }: { id: string }) => {
  // Simuleret produkt data
  const products = {
    '1': { 
      name: 'SimpleRouter Basic', 
      price: 0, 
      description: 'Vores gratis open-source routing løsning til små projekter.',
      features: ['Grundlæggende routing', 'URL parametre', 'Link komponenter', 'Nem at bruge']
    },
    '2': { 
      name: 'SimpleRouter Pro', 
      price: 49, 
      description: 'Avanceret routing til professionelle projekter med ekstra funktioner.',
      features: ['Alt fra Basic', 'Nested Routes', 'Route Guards', 'URL Query Parameters', 'History Management']
    },
    '3': { 
      name: 'SimpleRouter Enterprise', 
      price: 199, 
      description: 'Full-scale routing løsning til store virksomheder med fuld support.',
      features: ['Alt fra Pro', '24/7 Support', 'Custom Middleware', 'Analytics Integration', 'Advanced Caching']
    }
  };
  
  const product = products[id as keyof typeof products];
  
  if (!product) {
    return (
      <div style={{ padding: '20px', background: '#ffebee', borderRadius: '4px' }}>
        <h1>Produkt Ikke Fundet</h1>
        <p>Beklager, vi kunne ikke finde det produkt, du leder efter.</p>
        <Link to="/products" style={{ color: '#3498db' }}>Tilbage til Produkter</Link>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '4px' }}>
      <h1>{product.name}</h1>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>{product.description}</p>
      
      <div style={{ 
        display: 'inline-block',
        padding: '8px 16px',
        background: product.price === 0 ? '#2ecc71' : '#3498db',
        color: 'white',
        borderRadius: '4px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        {product.price === 0 ? 'Gratis' : `${product.price} DKK`}
      </div>
      
      <h2>Funktioner:</h2>
      <ul style={{ 
        listStyleType: 'none',
        padding: 0,
        margin: 0
      }}>
        {product.features.map((feature, index) => (
          <li key={index} style={{ 
            padding: '8px 0',
            borderBottom: index < product.features.length - 1 ? '1px solid #f0f0f0' : 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ 
              display: 'inline-block',
              width: '20px',
              height: '20px',
              background: '#2ecc71',
              borderRadius: '50%',
              marginRight: '10px',
              color: 'white',
              textAlign: 'center',
              lineHeight: '20px',
              fontSize: '12px'
            }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/products" style={{ 
          display: 'inline-block',
          padding: '8px 16px',
          background: '#f0f0f0',
          color: '#333',
          textDecoration: 'none',
          borderRadius: '4px',
          marginRight: '10px'
        }}>
          Tilbage til Produkter
        </Link>
        
        <Link to="/contact" style={{ 
          display: 'inline-block',
          padding: '8px 16px',
          background: '#3498db',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Kontakt for Mere Info
        </Link>
      </div>
    </div>
  );
};

const ContactPage = () => (
  <div style={{ padding: '20px', background: 'white', borderRadius: '4px' }}>
    <h1>Kontakt Os</h1>
    <p>Du er velkommen til at kontakte os med eventuelle spørgsmål.</p>
    
    <form style={{ 
      marginTop: '20px',
      display: 'grid',
      gap: '15px',
      maxWidth: '500px'
    }} onSubmit={(e) => e.preventDefault()}>
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Navn</label>
        <input type="text" style={{ 
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }} />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
        <input type="email" style={{ 
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }} />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Besked</label>
        <textarea rows={5} style={{ 
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          resize: 'vertical'
        }}></textarea>
      </div>
      
      <button style={{ 
        padding: '10px 16px',
        background: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Send Besked
      </button>
    </form>
  </div>
);

const NotFoundPage = () => (
  <div style={{ padding: '20px', background: '#ffebee', borderRadius: '4px', textAlign: 'center' }}>
    <h1 style={{ fontSize: '48px', margin: '20px 0' }}>404</h1>
    <h2>Siden Blev Ikke Fundet</h2>
    <p>Beklager, men den side du leder efter eksisterer ikke.</p>
    <Link 
      to="/"
      style={{ 
        display: 'inline-block',
        padding: '10px 20px',
        background: '#3498db',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        marginTop: '20px'
      }}
    >
      Tilbage til Forsiden
    </Link>
  </div>
);

// Header komponent med navigation
const Header = () => {
  const { currentPath } = useRouter();
  
  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };
  
  return (
    <header style={{ 
      background: '#2c3e50',
      color: 'white',
      padding: '15px 20px',
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '24px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>SimpleRouter</Link>
        </div>
        
        <nav>
          <ul style={{ 
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: '20px'
          }}>
            <li>
              <Link 
                to="/" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  fontWeight: isActive('/') ? 'bold' : 'normal',
                  borderBottom: isActive('/') ? '2px solid #3498db' : 'none',
                  paddingBottom: '5px'
                }}
              >
                Hjem
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  fontWeight: isActive('/about') ? 'bold' : 'normal',
                  borderBottom: isActive('/about') ? '2px solid #3498db' : 'none',
                  paddingBottom: '5px'
                }}
              >
                Om Os
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  fontWeight: isActive('/products') ? 'bold' : 'normal',
                  borderBottom: isActive('/products') ? '2px solid #3498db' : 'none',
                  paddingBottom: '5px'
                }}
              >
                Produkter
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  fontWeight: isActive('/contact') ? 'bold' : 'normal',
                  borderBottom: isActive('/contact') ? '2px solid #3498db' : 'none',
                  paddingBottom: '5px'
                }}
              >
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Footer komponent
const Footer = () => (
  <footer style={{ 
    background: '#2c3e50',
    color: 'white',
    padding: '20px',
    marginTop: '40px'
  }}>
    <div style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0' }}>SimpleRouter</h3>
        <p style={{ margin: 0, color: '#bdc3c7' }}>En simpel router implementation til React</p>
      </div>
      
      <div>
        <p style={{ margin: 0, color: '#bdc3c7' }}>© 2025 SimpleRouter. Alle rettigheder forbeholdes.</p>
      </div>
    </div>
  </footer>
);

// PathDisplay debugging component
const PathDebug = () => {
  const { currentPath } = useRouter();
  return (
    <div style={{ 
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 1000
    }}>
      Path: {currentPath}
    </div>
  );
};

// Main App Component
const CompleteRouterApp = () => {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      
      <main style={{ 
        flex: '1',
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '0 20px',
      }}>
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/products">
            <ProductsPage />
          </Route>
          <Route path="/products/:id">
            {(params) => <ProductDetailsPage id={params.id} />}
          </Route>
          <Route path="/contact">
            <ContactPage />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </main>
      
      <Footer />
      <PathDebug />
    </div>
  );
};

// Story Configuration
const meta: Meta = {
  title: 'SimpleRouter/CompleteDemo',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'En komplet demo af SimpleRouter der viser alle komponenter i brug i en realistisk applikation.'
      }
    }
  },
};

export default meta;
type Story = StoryObj;

// Main Story
export const CompleteDemo: Story = {
  render: () => {
    // Reset URL to home
    window.history.pushState({}, '', '/');
    
    return (
      <RouterProvider>
        <CompleteRouterApp />
      </RouterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Denne demo viser en komplet integreret applikation med alle SimpleRouter komponenter. Prøv at navigere rundt for at se, hvordan de forskellige ruter fungerer sammen.'
      }
    }
  }
};

// Different initial routes
export const ProductsPageDemo: Story = {
  render: () => {
    // Set URL to products
    window.history.pushState({}, '', '/products');
    
    return (
      <RouterProvider>
        <CompleteRouterApp />
      </RouterProvider>
    );
  },
  name: 'Produktsiden',
  parameters: {
    docs: {
      description: {
        story: 'En demonstration af applikationen med produktsiden som udgangspunkt.'
      }
    }
  }
};

export const ProductDetailsDemo: Story = {
  render: () => {
    // Set URL to product detail
    window.history.pushState({}, '', '/products/2');
    
    return (
      <RouterProvider>
        <CompleteRouterApp />
      </RouterProvider>
    );
  },
  name: 'Produktdetaljer',
  parameters: {
    docs: {
      description: {
        story: 'En demonstration af applikationen med produktdetaljesiden som udgangspunkt.'
      }
    }
  }
};

export const NotFoundDemo: Story = {
  render: () => {
    // Set URL to non-existent page
    window.history.pushState({}, '', '/this-does-not-exist');
    
    return (
      <RouterProvider>
        <CompleteRouterApp />
      </RouterProvider>
    );
  },
  name: '404 Siden',
  parameters: {
    docs: {
      description: {
        story: 'En demonstration af applikationens 404-side ved forsøg på at tilgå en ikke-eksisterende rute.'
      }
    }
  }
};
