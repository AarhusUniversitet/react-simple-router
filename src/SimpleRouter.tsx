// SimpleRouter.tsx
import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo, 
  useCallback, 
  ReactNode, 
  ReactElement, 
  use 
} from 'react';

// ==============================
// Types and Interfaces
// ==============================

export interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
  isActive: (path: string, exact?: boolean) => boolean;
}

export interface RouterProviderProps {
  children: ReactNode;
  initialPath?: string;
}

export interface RouteProps {
  path: string;
  exact?: boolean;
  children: ReactNode | ((params: Record<string, string>) => ReactNode);
}

export interface RouteGroupProps {
  prefix: string;
  children: ReactNode;
}

export interface LinkProps {
  to: string;
  children: ReactNode;
  activeClassName?: string;
  exact?: boolean;
  className?: string;
  style?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
}

export interface NavLinkProps extends LinkProps {
  activeClassName: string;
  exact?: boolean;
}

export interface SwitchProps {
  children: ReactNode;
}

export interface NotFoundProps {
  children: ReactNode;
}

export interface OutletContextType {
  params: Record<string, string>;
}

// ==============================
// Context Creation
// ==============================

// Router Context med default værdier
const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => console.warn('RouterProvider ikke fundet'),
  isActive: () => false
});

// Navngiv context for bedre debugging
RouterContext.displayName = 'RouterContext';

// Outlet Context til nested routes
const OutletContext = createContext<OutletContextType>({
  params: {}
});

// Type guard funktion til at tjekke om et element er en Route
function isRouteElement(element: any): element is React.ReactElement<RouteProps> {
  return (
    React.isValidElement(element) && 
    typeof (element.props as any).path === 'string'
  );
}

// ==============================
// Utility Functions
// ==============================

/**
 * Matcher en sti mod en route pattern og bestemmer om den matcher
 */
function matchPath(
  pattern: string, 
  path: string, 
  exact: boolean = false
): { match: boolean; params: Record<string, string> } {
  // Start med tomme parametre
  const params: Record<string, string> = {};
  
  // Håndter catch-all routes
  if (pattern === '*') {
    return { match: true, params };
  }
  
  // Håndter root path specialtilfælde
  if (pattern === '/' && path === '/') {
    return { match: true, params };
  }
  
  // Split patterns og faktiske stier
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = path.split('/').filter(Boolean);
  
  // Hvis exact er true, og længderne ikke matcher, så er der ingen match
  if (exact && patternSegments.length !== pathSegments.length) {
    return { match: false, params };
  }
  
  // Hvis ikke exact, så skal path være mindst lige så lang som pattern
  if (!exact && pathSegments.length < patternSegments.length) {
    return { match: false, params };
  }
  
  // Tjek hver segment
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i];
    const pathSeg = pathSegments[i];
    
    // Hvis dette er en parameter, gem værdien
    if (patternSeg.startsWith(':')) {
      const paramName = patternSeg.substring(1);
      params[paramName] = pathSeg;
    } 
    // Ellers skal segmenterne matche præcist
    else if (patternSeg !== pathSeg) {
      return { match: false, params };
    }
  }
  
  return { match: true, params };
}

// ==============================
// Components
// ==============================

/**
 * RouterProvider - Hovedkomponent der giver routing funktionalitet
 */
export function RouterProvider({ 
  children, 
  initialPath 
}: RouterProviderProps): ReactElement {
  // Initialiser state med den nuværende sti
  const [currentPath, setCurrentPath] = useState<string>(
    initialPath || window.location.pathname
  );

  // Funktion til at navigere til en ny sti
  const navigate = useCallback((to: string): void => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  }, []);
  
  // Funktion til at tjekke om en sti er aktiv
  const isActive = useCallback((path: string, exact: boolean = false): boolean => {
    const { match } = matchPath(path, currentPath, exact);
    return match;
  }, [currentPath]);

  // Lyt efter ændringer i browser historik
  useEffect(() => {
    const handleLocationChange = (): void => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Memoiser context værdi for at forbedre performance
  const contextValue = useMemo(() => ({
    currentPath,
    navigate,
    isActive
  }), [currentPath, navigate, isActive]);

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}

/**
 * useRouter - Hook til at få adgang til routing funktioner
 */
export function useRouter(): RouterContextType {
  return useContext(RouterContext);
}

/**
 * Route - Renderer indhold kun når stien matcher
 */
export function Route({ 
  path, 
  exact = false,
  children 
}: RouteProps): ReactElement | null {
  // Brug use() hook i stedet for useContext for fleksibilitet
  const { currentPath } = use(RouterContext);
  
  // Match stien
  const { match, params } = matchPath(path, currentPath, exact);
  
  if (!match) return null;
  
  // Opdater outlet context med den nuværende routes parametre
  const outletContextValue = useMemo(() => ({
    params
  }), [params]);
  
  // Renderer børn if stien matcher
  return (
    <OutletContext.Provider value={outletContextValue}>
      {typeof children === 'function' 
        ? children(params) as ReactElement 
        : children as ReactElement}
    </OutletContext.Provider>
  );
}

/**
 * RouteGroup - Bruges til at gruppere ruter under et fælles præfiks
 */
export function RouteGroup({
  prefix,
  children
}: RouteGroupProps): ReactElement {
  return (
    <>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child) || !isRouteElement(child)) {
          return child;
        }
        
        // Kombiner prefix med rute path
        const prefixedPath = `${prefix.endsWith('/') ? prefix.slice(0, -1) : prefix}${
          child.props.path.startsWith('/') ? child.props.path : `/${child.props.path}`
        }`;
        
        return React.cloneElement(child, {
          ...child.props,
          path: prefixedPath
        });
      })}
    </>
  );
}

/**
 * Link - Navigationselement
 */
export function Link({ 
  to, 
  children, 
  className,
  style,
  activeClassName,
  activeStyle,
  exact = false
}: LinkProps): ReactElement {
  // Brug use() hook i stedet for useContext
  const { navigate, isActive } = use(RouterContext);
  
  const isLinkActive = isActive(to, exact);
  
  // Beregn CSS klasser baseret på active state
  const linkClassName = `${className || ''} ${isLinkActive && activeClassName ? activeClassName : ''}`.trim();
  
  // Beregn CSS styles baseret på active state
  const linkStyle = {
    ...style,
    ...(isLinkActive && activeStyle ? activeStyle : {})
  };
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    navigate(to);
  };
  
  return (
    <a 
      href={to} 
      onClick={handleClick} 
      className={linkClassName || undefined}
      style={Object.keys(linkStyle).length > 0 ? linkStyle : undefined}
    >
      {children}
    </a>
  );
}

/**
 * NavLink - En specialiseret Link der automatisk tilføjer activeClassName
 */
export function NavLink(props: NavLinkProps): ReactElement {
  return <Link {...props} />;
}

/**
 * Switch - Renderer kun første matchende Route
 */
export function Switch({ children }: SwitchProps): ReactElement | null {
  const { currentPath } = useRouter();
  
  // Hjælpefunktion til at type-checke om et element er en Route-komponent
  const isRouteElement = (element: React.ReactNode): element is React.ReactElement<RouteProps> => {
    return (
      React.isValidElement(element) && 
      // Tjek at props indeholder en 'path' egenskab som en string
      typeof (element.props as any).path === 'string'
    );
  };
  
  // Find første matchende route
  const matchingChild = React.Children.toArray(children).find((child) => {
    // Brug custom type guard funktion
    if (!isRouteElement(child)) return false;
    
    // Nu kan vi sikkert tilgå path egenskaben
    const path = child.props.path;
    
    // Eksakt match
    if (path === currentPath) return true;
    
    // Håndter "catch-all" route
    if (path === "*") return true;
    
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
  
  // Vi bruger as React.ReactElement fordi TypeScript stadig ikke kan udlede typen korrekt
  // efter vores custom type guard
  return (matchingChild as React.ReactElement) || null;
}

/**
 * NotFound - Vises kun når ingen andre ruter matcher
 */
export function NotFound({ children }: NotFoundProps): ReactElement | null {
  const { currentPath } = use(RouterContext);
  
  // Denne skal have en metode til at registrere alle tilgængelige routes
  // Dette er bare en simpel placeholder
  const allRoutes: string[] = []; 
  
  const hasMatch = allRoutes.some(route => {
    const { match } = matchPath(route, currentPath);
    return match;
  });
  
  return !hasMatch ? (children as ReactElement) : null;
}

/**
 * Outlet - Bruges til nested routing, svarer til <Outlet /> i React Router v6
 */
export function Outlet(): ReactElement | null {
  const { params } = useContext(OutletContext);
  
  if (!params) {
    console.warn('Outlet bruges uden for en Route');
    return null;
  }
  
  return null; // Dette skulle være komponenten fra nested routes
}

/**
 * useParams - Giver adgang til route parametre
 */
export function useParams(): Record<string, string> {
  const { params } = useContext(OutletContext);
  return params;
}