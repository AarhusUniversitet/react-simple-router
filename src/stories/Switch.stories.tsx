import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RouterProvider, Route, Switch, useRouter } from '../SimpleRouter';

// Demo components for routes
const HomePage = () => (
  <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '4px' }}>
    <h2>Home Page</h2>
    <p>Dette er hjemmesiden. Velkommen!</p>
  </div>
);

const AboutPage = () => (
  <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '4px' }}>
    <h2>About Page</h2>
    <p>Læs mere om os og vores mission her.</p>
  </div>
);

const UserProfile = ({ id }: { id: string }) => (
  <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '4px' }}>
    <h2>User Profile</h2>
    <p>Dette er profilen for bruger med ID: <strong>{id}</strong></p>
  </div>
);

const NotFound = () => (
  <div style={{ padding: '20px', background: '#ffebee', borderRadius: '4px' }}>
    <h2>404 - Ikke Fundet</h2>
    <p>Beklager, den side du leder efter findes ikke.</p>
  </div>
);

// PathDisplay component til at vise den aktuelle sti
const PathDisplay = () => {
  const { currentPath } = useRouter();
  return (
    <div style={{ 
      marginBottom: '20px', 
      padding: '10px', 
      background: '#f8f9fa', 
      borderRadius: '4px',
      border: '1px solid #dee2e6'
    }}>
      Current path: <code>{currentPath}</code>
    </div>
  );
};

// Navigation control component
const RouteNavigation = () => {
  const { navigate } = useRouter();
  
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go Home
      </button>
      <button 
        onClick={() => navigate('/about')}
        style={{ padding: '8px 16px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go to About
      </button>
      <button 
        onClick={() => navigate('/user/42')}
        style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go to User #42
      </button>
      <button 
        onClick={() => navigate('/unknown')}
        style={{ padding: '8px 16px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go to Unknown Route
      </button>
    </div>
  );
};

// Switch Demo Component
const SwitchDemo = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Switch Component Demo</h2>
      <p>Switch renderer kun den første matchende Route - perfekt til en komplet routingopsætning med fallback.</p>
      <PathDisplay />
      <RouteNavigation />
      
      <div style={{ marginTop: '20px' }}>
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/user/:id">
            {(params) => <UserProfile id={params.id} />}
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Uden Switch</h3>
        <p>
          Uden Switch ville alle matchende routes blive vist. Prøv at navigere til "/" 
          og bemærk, at både homepage og 404 route ikke matcher samtidigt, takket være Switch.
        </p>
      </div>
    </div>
  );
};

// Multiple Routes Demo
const MultipleMatchingRoutesDemo = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Multiple Matching Routes Demo</h2>
      <p>Dette eksempel viser hvordan Switch kun renderer den første matchende route.</p>
      <PathDisplay />
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => window.history.pushState({}, '', '/user/special')}
          style={{ padding: '8px 16px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Go to Special User
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Med Switch (kun første match vises)</h3>
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '20px' }}>
          <Switch>
            <Route path="/user/special">
              <div style={{ padding: '10px', background: '#d1c4e9', borderRadius: '4px' }}>
                <h4>Speciel Bruger Route</h4>
                <p>Dette er en specifik bruger-route, der vil blive vist først i Switch.</p>
              </div>
            </Route>
            <Route path="/user/:id">
              {() => (
                <div style={{ padding: '10px', background: '#fff3e0', borderRadius: '4px' }}>
                  <h4>Generisk Bruger Route</h4>
                  <p>Dette er den generiske bruger-route med parametre. Den bør ikke vises samtidigt med den specifikke route.</p>
                </div>
              )}
            </Route>
          </Switch>
        </div>
        
        <h3>Uden Switch (begge matches vises)</h3>
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <Route path="/user/special">
            <div style={{ padding: '10px', background: '#d1c4e9', borderRadius: '4px', marginBottom: '10px' }}>
              <h4>Speciel Bruger Route</h4>
              <p>Dette er en specifik bruger-route.</p>
            </div>
          </Route>
          <Route path="/user/:id">
            {() => (
              <div style={{ padding: '10px', background: '#fff3e0', borderRadius: '4px' }}>
                <h4>Generisk Bruger Route</h4>
                <p>Dette er den generiske bruger-route med parametre.</p>
                <p>Uden Switch vil denne også blive vist sammen med den specifikke route.</p>
              </div>
            )}
          </Route>
        </div>
      </div>
    </div>
  );
};

// Switch Story Configuration
const meta: Meta<typeof Switch> = {
  title: 'SimpleRouter/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Switch komponenten renderer kun den første matchende Route, hvilket er nyttigt til at skabe gensidigt udelukkende routes.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Stories
export const SwitchDemo_Story: Story = {
  render: () => (
    <RouterProvider>
      <SwitchDemo />
    </RouterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration af Switch komponenten der viser, hvordan den vælger den første matchende route inklusiv en 404 fallback.'
      }
    }
  }
};

export const MultipleMatchingRoutes: Story = {
  render: () => {
    // Set initial path
    window.history.pushState({}, '', '/user/special');
    
    return (
      <RouterProvider>
        <MultipleMatchingRoutesDemo />
      </RouterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Denne story demonstrerer hvordan Switch kun viser den første matchende route, når flere routes kunne matche. Dette er særligt nyttigt ved specifikke vs. generiske routes.'
      }
    }
  }
};
