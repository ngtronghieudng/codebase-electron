import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { authMeApi } from '@/renderer/apis/auth.api';
import { QUERY_KEYS } from '@/renderer/definitions/constants/shared.const';
import { useAuthStore } from '@/renderer/stores/auth.store';

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
