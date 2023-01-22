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
      <h2>isElectron: {JSON.stringify(window.isElectron)}</h2>
      <p>https://sbclient.krud.dev/first/1/actuator</p>
      <p>https://sbclient.krud.dev/first/2/actuator</p>
      <p>https://sbclient.krud.dev/first/3/actuator</p>
      <p>https://sbclient.krud.dev/second/1/actuator</p>
      <p>https://sbclient.krud.dev/second/2/actuator</p>
      <p>https://sbclient.krud.dev/second/3/actuator</p>
      <p>https://sbclient.krud.dev/third/1/actuator</p>
      <p>https://sbclient.krud.dev/third/2/actuator</p>
      <p>https://sbclient.krud.dev/third/3/actuator</p>
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
