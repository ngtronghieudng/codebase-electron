import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { authProfileApi } from '@/renderer/apis/auth.api';
import { useAuthStore } from '@/renderer/stores/auth.store';
import { QUERY_KEYS } from '@/shared/definitions/constants/shared.const';

export const useAuthProfileQuery = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryFn: async () => {
      const response = await authProfileApi();
      return response.data;
    },
    queryKey: [QUERY_KEYS.AUTH.PROFILE],
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
};
