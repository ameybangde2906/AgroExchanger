import { useState, useEffect } from 'react';
import axios from 'axios';

const useLocationData = (url, params, filterKey) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!params) return; // Avoid making unnecessary API calls when params are not set
      setLoading(true);
      try {
        const response = await axios.get(url, {
          params: {
            'api-key': '579b464db66ec23bdd00000162cb3b1f099c42d0579d88da6670af37', // Replace with your API key
            format: 'json',
            limit: 100000,
            filters: params
          }
        });

        const records = response.data.records || [];
        const filteredData = records.map(record => record[filterKey]);
        setData([...new Set(filteredData)]); // Remove duplicates
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  return { data, loading, error };
};

export default useLocationData