import rootStore from '../stores';
import { useContext } from 'react';

export default function useStore(f = (it) => it) {
  const store = useContext(rootStore);
  return f(store);
}
