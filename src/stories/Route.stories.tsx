import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RouterProvider, Route, Link, useRouter } from '../SimpleRouter';

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
        onClick={() => navigate('/user/123')}
        style={{ padding: '8px 16px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go to User #123
      </button>
    </div>
  );
};

// Route Demo component
const RouteDemo = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Route Component Demo</h2>
      <PathDisplay />
      <RouteNavigation />
      
      <div style={{ marginTop: '20px' }}>
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/user/:id">
          {(params) => <UserProfile id={params.id} />}
        </Route>
        <Route path="/not-matched">
          <div>This won't be visible unless you navigate to /not-matched</div>
        </Route>
      </div>
    </div>
  );
};

// Route Story Configuration
const meta: Meta<typeof Route> = {
  title: 'SimpleRouter/Route',
  component: Route,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Route komponenten viser indhold kun når den nuværende URL matcher den angivne sti.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Route>;

// Stories
export const RouteDemo_Story: Story = {
  render: () => (
    <RouterProvider>
      <RouteDemo />
    </RouterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration af Route komponenten med forskellige ruter og parametre.'
      }
    }
  }
};

// Story med parameter route
export const ParameterizedRoute: Story = {
  render: () => {
    // Set initial path
    window.history.pushState({}, '', '/user/42');
    
    return (
      <RouterProvider>
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
          <PathDisplay />
          <p>Dette eksempel viser en Route med en parameter. Prøv at ændre URL'en til andre bruger-id'er.</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={() => window.history.pushState({}, '', '/user/1')}
              style={{ padding: '8px 16px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Bruger #1
            </button>
            <button 
              onClick={() => window.history.pushState({}, '', '/user/99')}
              style={{ padding: '8px 16px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Bruger #99
            </button>
          </div>
          
          <Route path="/user/:id">
            {(params) => <UserProfile id={params.id} />}
          </Route>
        </div>
      </RouterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Denne story viser hvordan Route kan tage parametre fra URL-pathen og videregive dem til children via en render-prop funktion.'
      }
    }
  }
};
