import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RouterProvider, Link, useRouter } from '../SimpleRouter';

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

// Link demo component
const LinkDemo = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Link Component Demo</h2>
      <PathDisplay />
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link 
          to="/"
          style={{ 
            padding: '8px 16px', 
            background: '#0d6efd', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}
        >
          Home
        </Link>
        
        <Link 
          to="/about"
          style={{ 
            padding: '8px 16px', 
            background: '#198754', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}
        >
          About
        </Link>
        
        <Link 
          to="/contact"
          style={{ 
            padding: '8px 16px', 
            background: '#dc3545', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}
        >
          Contact
        </Link>
      </div>
      
      <div style={{ 
        padding: '15px', 
        border: '1px solid #dee2e6', 
        borderRadius: '4px',
        background: '#fff' 
      }}>
        <h3>Styling Eksempler</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/styled-1" className="custom-class">Med className</Link>
          
          <Link 
            to="/styled-2" 
            style={{ 
              color: '#6610f2', 
              fontWeight: 'bold', 
              textDecoration: 'underline' 
            }}
          >
            Med inline style
          </Link>
          
          <Link 
            to="/styled-3" 
            style={{ 
              display: 'inline-block',
              padding: '12px 20px',
              background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
              color: 'white',
              borderRadius: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textDecoration: 'none',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '14px'
            }}
          >
            Fancy Styling
          </Link>
        </div>
      </div>
    </div>
  );
};

// Link Story Configuration
const meta: Meta<typeof Link> = {
  title: 'SimpleRouter/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Link komponenten giver mulighed for at navigere mellem routes uden at genindlæse siden.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Link>;

// Stories
export const LinkDemo_Story: Story = {
  render: () => (
    <RouterProvider>
      <LinkDemo />
    </RouterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration af Link komponenten med forskellige styling muligheder. Klik på links for at se path ændringer.'
      }
    }
  }
};

// Individual Link Story
export const BasicLink: Story = {
  render: () => (
    <RouterProvider>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <PathDisplay />
        <Link to="/example">Basic Link Example</Link>
      </div>
    </RouterProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'En enkel Link komponent til navigation.'
      }
    }
  }
};
