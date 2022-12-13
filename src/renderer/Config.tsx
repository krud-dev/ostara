import { useEffect, useState } from 'react';
import { Configuration } from '../infra/configuration/model/configuration';

function Config() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [config, setConfig] = useState<Configuration | null>(null);

  function refreshConfig() {
    setLoading(true);
    window.configuration
      .getConfiguration()
      .then(setConfig)
      .catch(setError)
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <div>
      <h1>Configuration</h1>
      <p>Loading: {`${loading}`}</p>
      <p>Error: {error}</p>
      <button type="button" onClick={refreshConfig}>
        Refresh
      </button>
      <pre>{JSON.stringify(config?.items, null, 2)}</pre>;
    </div>
  );
}

export default Config;
