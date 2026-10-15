import { useEffect, useState } from "react";
import { getLandParcels } from "../services/landService";

export function useLandParcels() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getLandParcels()
      .then((data) => {
        if (active) setParcels(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { parcels, loading, error };
}
