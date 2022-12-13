import { useState } from 'react';

export type ActuatorPlaygroundProps = {
  url: string;
};
function ActuatorPlayground({ url }: ActuatorPlaygroundProps) {
  const [returnData, setReturnData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div>
      <h1>Actuator Playground</h1>
      <p>URL: {url}</p>
      <p>Loading: {`${loading}`}</p>
      <div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            window.actuator
              .health(url)
              .then((data) => setReturnData(JSON.stringify(data, null, 2)))
              .catch((err) => setReturnData(err.message))
              .finally(() => setLoading(false));
          }}
        >
          Health
        </button>
      </div>
      <pre>
        <code>{returnData}</code>
      </pre>
    </div>
  );
}

export default ActuatorPlayground;
