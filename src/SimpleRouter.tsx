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

// Symbol der bruges til at detektere når useRouter kaldes uden for en RouterProvider
const PROVIDER_NOT_FOUND = Symbol('PROVIDER_NOT_FOUND');

// Router Context med sentinel værdi istedet for default værdi
const RouterContext = createContext<RouterContextType | typeof PROVIDER_NOT_FOUND>(PROVIDER_NOT_FOUND);

// Navngiv context for bedre debugging
RouterContext.displayName = 'RouterContext';

// Type guard til at kontrollere om en værdi er en gyldig RouterContextType
function isRouterContext(value: RouterContextType | typeof PROVIDER_NOT_FOUND): value is RouterContextType {
  return value !== PROVIDER_NOT_FOUND;
}

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
  // Til debugging
  console.log(`Matching pattern "${pattern}" against path "${path}" (exact: ${exact})`);

  // Start med tomme parametre
  const params: Record<string, string> = {};

  // Håndter catch-all routes
  if (pattern === '*') {
    console.log('Match: Catch-all route');
    return { match: true, params };
  }

  // Håndter root path specialtilfælde
  if (pattern === '/' && path === '/') {
    console.log('Match: Root path');
    return { match: true, params };
  }

  // Split patterns og faktiske stier - fjern tomme segmenter mere robust
  const patternSegments = pattern.split('/').filter(seg => seg !== '');
  const pathSegments = path.split('/').filter(seg => seg !== '');

  console.log('Pattern segments:', patternSegments);
  console.log('Path segments:', pathSegments);

  // Hvis exact er true, og længderne ikke matcher, så er der ingen match
  if (exact && patternSegments.length !== pathSegments.length) {
    console.log('No match: exact match required but segment lengths differ');
    return { match: false, params };
  }

  // Håndter prefix-matching for non-exact matches
  if (!exact) {
    // For non-exact matching, må vi stadig sikre at alle pattern segmenter matcher
    // i starten af pathen
    if (pathSegments.length < patternSegments.length) {
      console.log('No match: path segments fewer than pattern segments for non-exact match');
      return { match: false, params };
    }

    // For non-exact matching, vi tjekker kun så mange segmenter som pattern har
    const segmentsToCheck = patternSegments.length;
    for (let i = 0; i < segmentsToCheck; i++) {
      const patternSeg = patternSegments[i];
      const pathSeg = pathSegments[i];

      // Hvis dette er en parameter, gem værdien
      if (patternSeg.startsWith(':')) {
        const paramName = patternSeg.substring(1);
        params[paramName] = pathSegments[i];
        continue;
      }

      // Ellers skal segmenterne matche præcist
      if (patternSeg !== pathSeg) {
        console.log(`No match: segment mismatch at index ${i}: "${patternSeg}" vs "${pathSeg}"`);
        return { match: false, params };
      }
    }

    console.log('Match: non-exact with params', params);
    return { match: true, params };
  }

  // Exact matching - længderne skulle allerede matche her
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i];
    const pathSeg = pathSegments[i];

    // Hvis dette er en parameter, gem værdien
    if (patternSeg.startsWith(':')) {
      const paramName = patternSeg.substring(1);
      params[paramName] = pathSegments[i];
      continue;
    }

    // Ellers skal segmenterne matche præcist
    if (patternSeg !== pathSeg) {
      console.log(`No match: segment mismatch at index ${i}: "${patternSeg}" vs "${pathSeg}"`);
      return { match: false, params };
    }
  }

  console.log('Match: exact with params', params);
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
  const context = useContext(RouterContext);

  // Tjek om context er vores sentinel værdi, hvilket indikerer at hooket
  // er brugt uden for en RouterProvider
  if (!isRouterContext(context)) {
    throw new Error('useRouter skal bruges inden for en RouterProvider');
  }

  return context;
}

/**
 * Route - Renderer indhold kun når stien matcher
 */
export function Route({
  path,
  exact = false,
  children
}: RouteProps): ReactElement | null {
  // Brug useRouter i stedet for direkte use() for at få fejlhåndtering
  const { currentPath } = useRouter();

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
 * Link - Navigationselement
 */
export function Link({
  to,
  children,
  className,
  style,
  activeClassName,
  activeStyle,
  exact = false,
  ...restProps
}: LinkProps & Record<string, any>): ReactElement {
  // Brug useRouter for at få fejlhåndtering
  const { navigate, isActive } = useRouter();

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
      {...restProps}
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
  // Brug useRouter i stedet for use() for fejlhåndtering
  const { currentPath } = useRouter();

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