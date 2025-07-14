import { useState, useEffect } from 'react';
import { fetchBugs } from '../utils/api';
import { fetchRoomBugs } from '../utils/rooms';

export function useBugs(roomId = null) {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetch = roomId ? fetchRoomBugs(roomId) : fetchBugs();
    fetch
      .then((data) => {
        if (isMounted) setBugs(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Error fetching bugs');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  return { bugs, loading, error, setBugs };
}
