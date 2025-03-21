// SimpleRouter.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, ReactElement } from 'react';

// Interfaces
export interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

export interface RouterProviderProps {
  children: ReactNode;
}

export interface RouteProps {
  path: string;
  children: ReactNode | ((params: Record<string, string>) => ReactNode);
}

export interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SwitchProps {
  children: ReactNode;
}

export interface NotFoundProps {
  children: ReactNode;
}

// Skab Router Context
const RouterContext = createContext<RouterContextType | undefined>(undefined);

// Router Provider Component
export function RouterProvider({ children }: RouterProviderProps): ReactElement {
  // Initialiser state med den nuværende sti
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  // Lyt efter ændringer i browser historik
  useEffect(() => {
    const handleLocationChange = (): void => {
      setCurrentPath(window.location.pathname);
    };

    // Lyt efter popstate event (når brugeren navigerer frem/tilbage)
    window.addEventListener('popstate', handleLocationChange);

    // Oprydning
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Funktion til at navigere til en ny sti
  const navigate = (to: string): void => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

// Custom hook til at bruge router
export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter skal bruges inden for en RouterProvider');
  }
  return context;
}

// Route Component
export function Route({ path, children }: RouteProps): ReactElement | null {
  const { currentPath } = useRouter();
  
  // Simpel path matching (kan udvides med mere avanceret pattern matching)
  const isMatch = (): boolean => {
    // Eksakt match
    if (path === currentPath) return true;
    
    // Enkel parameter matching (f.eks. /users/:id)
    const pathSegments = path.split('/');
    const currentSegments = currentPath.split('/');
    
    if (pathSegments.length !== currentSegments.length) return false;
    
    for (let i = 0; i < pathSegments.length; i++) {
      if (pathSegments[i].startsWith(':')) continue; // Parameter, så spring over
      if (pathSegments[i] !== currentSegments[i]) return false;
    }
    
    return true;
  };

  // Parse parametre fra URL
  const getParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    const pathSegments = path.split('/');
    const currentSegments = currentPath.split('/');
    
    for (let i = 0; i < pathSegments.length; i++) {
      if (pathSegments[i].startsWith(':')) {
        const paramName = pathSegments[i].substring(1);
        params[paramName] = currentSegments[i];
      }
    }
    
    return params;
  };

  // Render børn hvis stien matcher, ellers null
  return isMatch() ? (
    typeof children === 'function' ? 
      children(getParams()) as ReactElement : 
      children as ReactElement
  ) : null;
}

// Link Component
export function Link({ to, children, className, style, ...restProps }: LinkProps & Record<string, any>): ReactElement {
  const { navigate } = useRouter();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    navigate(to);
  };
  
  return (
    <a href={to} onClick={handleClick} className={className} style={style} {...restProps}>
      {children}
    </a>
  );
}

// Switch Component der kun renderer første matchende Route
export function Switch({ children }: SwitchProps): ReactElement | null {
  const { currentPath } = useRouter();
  
  // Find første matchende route
  const matchingChild = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    
    const path = child.props.path as string;
    // Eksakt match
    if (path === currentPath) return true;
    
    // Simpel parameter matching
    const pathSegments = path.split('/');
    const currentSegments = currentPath.split('/');
    
    if (pathSegments.length !== currentSegments.length) return false;
    
    for (let i = 0; i < pathSegments.length; i++) {
      if (pathSegments[i].startsWith(':')) continue;
      if (pathSegments[i] !== currentSegments[i]) return false;
    }
    
    return true;
  });
  
  return (matchingChild as ReactElement) || null;
}

// NotFound Component til at vise når ingen ruter matcher
export function NotFound({ children }: NotFoundProps): ReactElement | null {
  const { currentPath } = useRouter();
  const allRoutes: string[] = []; // Dette kunne udvides til at registrere alle ruter
  
  // Tjek om nuværende sti er i allRoutes
  const isPathRegistered = allRoutes.some(route => {
    // Her skulle vi implementere samme matchings-logik som i Route
    return route === currentPath;
  });
  
  return !isPathRegistered ? (children as ReactElement) : null;
}