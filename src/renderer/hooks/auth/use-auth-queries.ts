import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { authMeApi } from '@/renderer/apis/auth.api';
import { useAuthStore } from '@/renderer/stores/auth.store';
import { QUERY_KEYS } from '@/shared/definitions/constants/shared.const';

export const useAuthMeQuery = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryFn: async () => {
      const response = await authMeApi();
      return response.data;
    },
    queryKey: [QUERY_KEYS.AUTH.ME],
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};
