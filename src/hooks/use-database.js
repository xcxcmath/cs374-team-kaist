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

  const setter = useCallback(ref.set.bind(ref), [ref]);
  const updater = useCallback(ref.update.bind(ref), [ref]);

  return [value, setter, updater, loaded];
}

export function useUserDatabase(userID, entry = '', f = (v) => v) {
  const [v, s, u, l] = useDatabase(`users/${userID}/${entry}`);
  const vv = useMemo(() => f(v), [v, f]);
  return [vv, s, u, l];
}

export function useRequestDatabase(userID = null) {
  const entryString =
    userID && userID.length ? `requests/${userID}` : 'requests';
  const dat = useDatabase(entryString);

  if (!userID) {
    return [null, null, null, null];
  } else {
    return dat;
  }
}
