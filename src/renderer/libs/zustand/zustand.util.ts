import type { StateCreator } from 'zustand';

import { create as actualCreate } from 'zustand';

const storeResetFns = new Set<() => void>();

const createStore = <T>(stateCreator: StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getInitialState();

  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

export const create = (<T>(stateCreator?: StateCreator<T>) => {
  if (stateCreator) {
    return createStore(stateCreator);
  }
  return (initializer: StateCreator<T>) => createStore(initializer);
}) as typeof actualCreate;

export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};
