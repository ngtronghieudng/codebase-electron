import { Suspense, useCallback, useEffect, useState } from 'react';
import { Navigate, Route, RouteObject, Routes } from 'react-router';

import { useAuthStore } from '@/renderer/stores/auth.store';
import {
  AUTH_PAGE,
  FORBIDDEN_PAGE,
} from '@/shared/definitions/constants/route-pages.const';
import { EUserRole } from '@/shared/definitions/enums/shared.enum';

import { ThePageLoading } from './components/shared/ThePageLoading';

type TRouteObject = Omit<RouteObject, 'children'> & {
  children?: TRouteObject[];
  meta?: {
    requiresAuth: boolean;
    roles: EUserRole[];
    title: string;
  };
};

const modules = import.meta.glob<{ default: TRouteObject }>('@/routes/*.tsx');
const routeCache = new Map<string, TRouteObject>();

export const AppRoutes: React.FC = () => {
  const [routes, setRoutes] = useState<TRouteObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRouteConfig = async (
    path: string,
    loader: () => Promise<{ default: TRouteObject }>,
  ): Promise<TRouteObject> => {
    const cached = routeCache.get(path);
    if (cached) return cached;

    const module = await loader();
    routeCache.set(path, module.default);
    return module.default;
  };

  useEffect(() => {
    const loadAllRoutes = async () => {
      const loadedRoutes = await Promise.all(
        Object.entries(modules).map(([path, loader]) =>
          loadRouteConfig(path, loader),
        ),
      );
      setRoutes(loadedRoutes);
      setIsLoading(false);
    };

    loadAllRoutes();
  }, []);

  if (isLoading) return <ThePageLoading />;

  return (
    <Suspense fallback={<ThePageLoading />}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

const renderRoutes = (routes: TRouteObject[]) => {
  return routes.map((route, index) => {
    const hasChildren = route.children && route.children.length > 0;
    if (hasChildren)
      return (
        <Route
          element={<ProtectedRoute route={route} />}
          key={index}
          path={route.path}
        >
          {route.children &&
            route.children.map((child, childIndex) => (
              <Route
                element={<ProtectedRoute route={child} />}
                index={child.index}
                key={childIndex}
                path={child.path}
              />
            ))}
        </Route>
      );

    return (
      <Route
        element={<ProtectedRoute route={route} />}
        key={index}
        path={route.path}
      />
    );
  });
};

const ProtectedRoute: React.FC<{ route: TRouteObject }> = ({ route }) => {
  const [element, setElement] = useState<React.ReactNode>(null);

  const handleRouteGuard = useCallback(async () => {
    if (route.meta?.title) document.title = route.meta.title;

    if (route.meta?.requiresAuth) {
      await useAuthStore.getState().initialize();

      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      if (!isAuthenticated) {
        setElement(<Navigate replace to={AUTH_PAGE.LOGIN} />);
        return;
      }

      const userRole = useAuthStore.getState().userInfo?.role;
      const requiresRoles = route.meta.roles || [];
      const hasRequiredRole = requiresRoles.some((role) => role === userRole);
      if (requiresRoles.length && !hasRequiredRole) {
        setElement(<Navigate replace to={FORBIDDEN_PAGE} />);
        return;
      }
    }
    setElement(route.element);
  }, [
    route.element,
    route.meta?.requiresAuth,
    route.meta?.roles,
    route.meta?.title,
  ]);

  useEffect(() => {
    handleRouteGuard();
  }, [handleRouteGuard]);

  return element;
};
