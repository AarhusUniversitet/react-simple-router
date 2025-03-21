import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RouterProvider, useRouter } from '../SimpleRouter';

// Router Current Path Display Component (til at vise path i stories)
const CurrentPath = () => {
  const { currentPath } = useRouter();
  return <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '10px' }}>
    Current Path: <strong>{currentPath}</strong>
  </div>;
};

// Router Navigate Component (til at demonstrere navigation i stories)
const NavigationButtons = () => {
  const { navigate } = useRouter();
  
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '8px 16px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Home
      </button>
      <button 
        onClick={() => navigate('/about')}
        style={{ padding: '8px 16px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        About
      </button>
      <button 
        onClick={() => navigate('/user/42')}
        style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        User Profile
      </button>
    </div>
  );
};

// RouterDemo Component
const RouterDemo = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>Router Provider Demo</h2>
      <CurrentPath />
      <NavigationButtons />
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <p>Dette er en demo af RouterProvider. Klik på knapperne ovenfor for at simulere navigation.</p>
        <p>Bemærk hvordan <code>currentPath</code> opdateres, når du navigerer.</p>
      </div>
    </div>
  );
};

// RouterProvider Story Configuration
const meta: Meta<typeof RouterProvider> = {
  title: 'SimpleRouter/RouterProvider',
  component: RouterProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'RouterProvider er hovedkomponenten i SimpleRouter. Den indeholder routing state og giver tilgang til navigation via React Context.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RouterProvider>;

// Stories
export const Basic: Story = {
  render: () => (
    <RouterProvider>
      <RouterDemo />
    </RouterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grundlæggende brug af RouterProvider med navigationsknapper der opdaterer routing state.'
      }
    }
  }
};

// Customized Story med forudindstillet path
export const CustomInitialPath: Story = {
  render: () => {
    // Simuler en anden sti
    window.history.pushState({}, '', '/about');
    
    return (
      <RouterProvider>
        <RouterDemo />
      </RouterProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'RouterProvider initialiseret med en anden sti (/about) for at vise forskellige udgangspunkter.'
      }
    }
  }
};
