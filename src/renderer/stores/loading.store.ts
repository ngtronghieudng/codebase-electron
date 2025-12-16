import { create } from '@/renderer/libs/zustand/zustand.util';

interface IState {
  hideLoading: () => void;
  isLoading: boolean;
  showLoading: () => void;
}

export const useLoadingStore = create<IState>((set) => ({
  hideLoading: () => set({ isLoading: false }),
  isLoading: false,
  showLoading: () => set({ isLoading: true }),
}));
