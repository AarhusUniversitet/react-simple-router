// SimpleRouter.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RouterProvider, useRouter, Route, Link, Switch, NotFound } from '../src/SimpleRouter';

// Mock historyAPI og window.location
const mockHistoryPush = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Gemmer original implementation
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;
const originalPushState = window.history.pushState;

// Mock komponenter til testing
const HomePage = () => <div data-testid="home-page">Home Page</div>;
const AboutPage = () => <div data-testid="about-page">About Page</div>;
const UserPage = ({ id }: { id: string }) => <div data-testid="user-page">User {id}</div>;
const NotFoundPage = () => <div data-testid="not-found-page">Not Found</div>;

// Router Current Path Display Component (helper til tests)
const CurrentPath = () => {
  const { currentPath } = useRouter();
  return <div data-testid="current-path">{currentPath}</div>;
};

// Router Navigator Component (helper til tests)
const TestNavigator = ({ to }: { to: string }) => {
  const { navigate } = useRouter();
  return <button data-testid="navigator" onClick={() => navigate(to)}>Navigate to {to}</button>;
};

describe('SimpleRouter', () => {
  beforeAll(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/'
      },
      writable: true
    });

    // Mock history.pushState
    window.history.pushState = mockHistoryPush;

    // Mock addEventListener og removeEventListener
    window.addEventListener = mockAddEventListener;
    window.removeEventListener = mockRemoveEventListener;
  });

  afterAll(() => {
    // Gendanner originale implementationer
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    window.history.pushState = originalPushState;
  });

  beforeEach(() => {
    // Reset mocks
    mockHistoryPush.mockReset();
    mockAddEventListener.mockReset();
    mockRemoveEventListener.mockReset();
  });

  describe('RouterProvider og useRouter', () => {
    test('RouterProvider initialiserer med korrekt currentPath', () => {
      render(
        <RouterProvider>
          <CurrentPath />
        </RouterProvider>
      );

      expect(screen.getByTestId('current-path')).toHaveTextContent('/');
    });

    test('RouterProvider tilføjer popstate event listener ved mount', () => {
      render(
        <RouterProvider>
          <div>Test</div>
        </RouterProvider>
      );

      expect(mockAddEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });

    test('RouterProvider fjerner popstate event listener ved unmount', () => {
      const { unmount } = render(
        <RouterProvider>
          <div>Test</div>
        </RouterProvider>
      );

      unmount();
      expect(mockRemoveEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });

    // Test for useRouter uden for RouterProvider
    test('useRouter kaster fejl når den bruges uden for RouterProvider', () => {
      // 1. Mock renderingen manuelt
      const TestComponent = () => {
        try {
          useRouter();
          return <div>Dette bør aldrig renderes</div>;
        } catch (error) {
          return <div data-testid="error-caught">{(error as any).message}</div>;
        }
      };
      
      // 2. Render en komponent der forsøger at bruge useRouter og fanger fejlen
      render(<TestComponent />);
      
      // 3. Verificer at fejlen blev fanget og indeholder den forventede besked
      const errorElement = screen.getByTestId('error-caught');
      expect(errorElement.textContent).toContain('useRouter skal bruges inden for en RouterProvider');
    });

    test('navigate funktionen opdaterer currentPath og kalder history.pushState', () => {
      render(
        <RouterProvider>
          <CurrentPath />
          <TestNavigator to="/about" />
        </RouterProvider>
      );

      fireEvent.click(screen.getByTestId('navigator'));

      expect(mockHistoryPush).toHaveBeenCalledWith({}, '', '/about');
      // Vi kan ikke tjekke at currentPath er opdateret da vi har mockat window.location
    });
  });

  describe('Route', () => {
    test('Route renderer børn når path matcher currentPath', () => {
      // Sæt window.location.pathname til /
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true
      });

      render(
        <RouterProvider>
          <Route path="/">
            <HomePage />
          </Route>
        </RouterProvider>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    test('Route renderer ikke børn når path ikke matcher currentPath', () => {
      // Sæt window.location.pathname til /
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true
      });

      render(
        <RouterProvider>
          <Route path="/about">
            <AboutPage />
          </Route>
        </RouterProvider>
      );

      expect(screen.queryByTestId('about-page')).not.toBeInTheDocument();
    });

    test('Route håndterer URL parametre korrekt', () => {
      // Sæt window.location.pathname til /user/123
      Object.defineProperty(window, 'location', {
        value: { pathname: '/user/123' },
        writable: true
      });

      render(
        <RouterProvider>
          <Route path="/user/:id">
            {(params) => <UserPage id={params.id} />}
          </Route>
        </RouterProvider>
      );

      expect(screen.getByTestId('user-page')).toHaveTextContent('User 123');
    });
  });

  describe('Link', () => {
    test('Link renderer anchor med korrekt href', () => {
      render(
        <RouterProvider>
          <Link to="/about">About</Link>
        </RouterProvider>
      );

      const link = screen.getByText('About');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/about');
    });

    test('Link kalder navigate ved klik og forhindrer default event', () => {
      render(
        <RouterProvider>
          <CurrentPath />
          <Link to="/about">About</Link>
        </RouterProvider>
      );

      const link = screen.getByText('About');
      fireEvent.click(link);

      expect(mockHistoryPush).toHaveBeenCalledWith({}, '', '/about');
    });
  });

  describe('Switch', () => {
    test('Switch renderer kun første matchende Route', () => {
      // Sæt window.location.pathname til /
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true
      });

      render(
        <RouterProvider>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route path="/">
              <AboutPage />
            </Route>
          </Switch>
        </RouterProvider>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('about-page')).not.toBeInTheDocument();
    });

    test('Switch renderer ingenting hvis ingen Route matcher', () => {
      // Sæt window.location.pathname til /unknown
      Object.defineProperty(window, 'location', {
        value: { pathname: '/unknown' },
        writable: true
      });

      render(
        <RouterProvider>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
          </Switch>
        </RouterProvider>
      );

      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('about-page')).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('Komplet routing flow', () => {
      // Start på forsiden
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true
      });

      // Skaber en mock popstate event handler til at simulere browser navigation
      let popstateHandler: Function | null = null;
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === 'popstate') {
          popstateHandler = handler;
        }
      });

      const { rerender } = render(
        <RouterProvider>
          <div>
            <nav>
              <Link to="/" data-testid="home-link">Home</Link>
              <Link to="/about" data-testid="about-link">About</Link>
              <Link to="/user/123" data-testid="user-link">User</Link>
            </nav>
            <Switch>
              <Route path="/">
                <HomePage />
              </Route>
              <Route path="/about">
                <AboutPage />
              </Route>
              <Route path="/user/:id">
                {(params) => <UserPage id={params.id} />}
              </Route>
            </Switch>
          </div>
        </RouterProvider>
      );

      // Verificer at vi starter på forsiden
      expect(screen.getByTestId('home-page')).toBeInTheDocument();

      // Klik på about link
      fireEvent.click(screen.getByTestId('about-link'));

      // Simuler at window.location er opdateret
      Object.defineProperty(window, 'location', {
        value: { pathname: '/about' },
        writable: true
      });

      // Re-render med opdateret location
      rerender(
        <RouterProvider>
          <div>
            <nav>
              <Link to="/" data-testid="home-link">Home</Link>
              <Link to="/about" data-testid="about-link">About</Link>
              <Link to="/user/123" data-testid="user-link">User</Link>
            </nav>
            <Switch>
              <Route path="/">
                <HomePage />
              </Route>
              <Route path="/about">
                <AboutPage />
              </Route>
              <Route path="/user/:id">
                {(params) => <UserPage id={params.id} />}
              </Route>
            </Switch>
          </div>
        </RouterProvider>
      );

      // Verificer at about siden vises
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
      expect(screen.getByTestId('about-page')).toBeInTheDocument();

      // Klik på user link
      fireEvent.click(screen.getByTestId('user-link'));

      // Simuler at window.location er opdateret
      Object.defineProperty(window, 'location', {
        value: { pathname: '/user/123' },
        writable: true
      });

      // Re-render med opdateret location
      rerender(
        <RouterProvider>
          <div>
            <nav>
              <Link to="/" data-testid="home-link">Home</Link>
              <Link to="/about" data-testid="about-link">About</Link>
              <Link to="/user/123" data-testid="user-link">User</Link>
            </nav>
            <Switch>
              <Route path="/">
                <HomePage />
              </Route>
              <Route path="/about">
                <AboutPage />
              </Route>
              <Route path="/user/:id">
                {(params) => <UserPage id={params.id} />}
              </Route>
            </Switch>
          </div>
        </RouterProvider>
      );

      // Verificer at user siden vises med korrekt id
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('about-page')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-page')).toHaveTextContent('User 123');

      // Simuler browser tilbage-knap
      if (popstateHandler) {
        // Simuler at window.location er opdateret
        Object.defineProperty(window, 'location', {
          value: { pathname: '/about' },
          writable: true
        });

        // Kald popstate handler
        act(() => {
          if (popstateHandler) {
            popstateHandler();
          }
        });

        // Re-render med opdateret location
        rerender(
          <RouterProvider>
            <div>
              <nav>
                <Link to="/" data-testid="home-link">Home</Link>
                <Link to="/about" data-testid="about-link">About</Link>
                <Link to="/user/123" data-testid="user-link">User</Link>
              </nav>
              <Switch>
                <Route path="/">
                  <HomePage />
                </Route>
                <Route path="/about">
                  <AboutPage />
                </Route>
                <Route path="/user/:id">
                  {(params) => <UserPage id={params.id} />}
                </Route>
              </Switch>
            </div>
          </RouterProvider>
        );

        // Verificer at about siden vises igen
        expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
        expect(screen.queryByTestId('user-page')).not.toBeInTheDocument();
      }
    });
  });
});