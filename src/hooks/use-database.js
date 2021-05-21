import { useState, useEffect, useCallback, useMemo } from 'react';
import { database } from '../stores/firebase';

export default function useDatabase(entry) {
  const [value, setValue] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const ref = useMemo(() => database.ref(entry), [entry]);
  const listener = useCallback((snapshot) => {
    setValue(snapshot.val());
    setLoaded(true);
  }, []);
  useEffect(() => {
    ref.on('value', listener);
    return () => {
      ref.off('value', listener);
    };
  }, [ref, listener]);

  return [value, ref.set.bind(ref), ref.update.bind(ref), loaded];
}

export function useUserDatabase(userID, entry = '', f = (v) => v) {
  const [v, s, u, l] = useDatabase(`users/${userID}/${entry}`);
  const vv = useMemo(() => f(v), [v, f]);
  return [vv, s, u, l];
}

export function useRequestDatabase(userID) {
  return useDatabase(`requests/${userID}`);
}
