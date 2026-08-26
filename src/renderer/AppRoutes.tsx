import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, RouteObject, Routes } from 'react-router';

import { useAuthStore } from '@/renderer/stores/auth.store';

import { ThePageLoading } from './components/common/ThePageLoading';
import {
  AUTH_PAGE,
  FORBIDDEN_PAGE,
  HOME_PAGE,
} from './definitions/constants/route-pages.const';
import { EUserRole } from './definitions/enums/shared.enum';
import { TRouteMeta } from './definitions/types/shared.type';

type TRouteObject = Omit<RouteObject, 'children'> & {
  children?: TRouteObject[];
  meta?: TRouteMeta;
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
    if (cached) {
      return cached;
    }

    const module = await loader();
    routeCache.set(path, module.default);
    return module.default;
  };

  useEffect(() => {
    const bootstrap = async () => {
      const loadRoutesPromise = Promise.all(
        Object.entries(modules).map(([path, loader]) =>
          loadRouteConfig(path, loader),
        ),
      );
      const [loadedRoutes] = await Promise.all([
        loadRoutesPromise,
        useAuthStore.getState().initialize(),
      ]);

      setRoutes(loadedRoutes);
      setIsLoading(false);
    };

    bootstrap();
  }, []);

  if (isLoading) {
    return <ThePageLoading />;
  }

  return (
    <Suspense fallback={<ThePageLoading />}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
};

const renderRoutes = (routes: TRouteObject[]) => {
  return routes.map((route, index) => {
    const hasChildren = route.children && route.children.length > 0;
    if (hasChildren) {
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
    }

    return (
      <Route
        element={<ProtectedRoute route={route} />}
        key={index}
        path={route.path}
      />
    );
  });
};

const resolveRouteElement = (
  route: TRouteObject,
  isAuthenticated: boolean,
  userRole: EUserRole | undefined,
): React.ReactNode => {
  if (route.meta?.guestOnly && isAuthenticated) {
    return <Navigate replace to={HOME_PAGE} />;
  }

  if (route.meta?.requiresAuth) {
    if (!isAuthenticated) {
      return <Navigate replace to={AUTH_PAGE.LOGIN} />;
    }

    const requiresRoles = route.meta.roles || [];
    const hasRequiredRole = requiresRoles.some((role) => role === userRole);

    if (requiresRoles.length && !hasRequiredRole) {
      return <Navigate replace to={FORBIDDEN_PAGE} />;
    }
  }

  return route.element;
};

const ProtectedRoute: React.FC<{ route: TRouteObject }> = ({ route }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.userInfo?.role);

  const routeElement = resolveRouteElement(route, isAuthenticated, userRole);

  return <>{routeElement}</>;
};
