import { useState } from 'react';

export type ActuatorPlaygroundProps = {
  url: string;
};
function ActuatorPlayground({ url }: ActuatorPlaygroundProps) {
  const [returnData, setReturnData] = useState<string>('');

  return (
    <div>
      <h1>Actuator Playground</h1>
      <p>URL: {url}</p>
      <div>
        <button
          type="button"
          onClick={() =>
            setReturnData(
              JSON.stringify(window.electron.actuator.health(url), null, 2)
            )
          }
        >
          Health
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={() =>
            setReturnData(
              JSON.stringify(window.electron.actuator.info(url), null, 2)
            )
          }
        >
          Info
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={() =>
            setReturnData(
              JSON.stringify(window.electron.actuator.loggers(url), null, 2)
            )
          }
        >
          Loggers
        </button>
      </div>
      <pre>
        <code>{returnData}</code>
      </pre>
    </div>
  );
}

export default ActuatorPlayground;
