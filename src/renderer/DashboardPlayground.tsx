import { useEffect, useState } from 'react';

function DashboardPlayground(value: any) {
  const metric = 'process.uptime[VALUE]';
  const instanceId = 'af3cf2c6-47bc-47e4-86f0-456e9f4bc361';
  const [currentValue, setCurrentValue] = useState(0);
  const [unsubscribeFn, setUnsubscribeFn] = useState<() => void>(() => () => {});
  function doSubscribe() {
    console.log('doSubscribe');
    window.metrics
      .subscribeToMetric(instanceId, metric, (_, metricDto) => {
        console.log('Received data');
        setCurrentValue(metricDto.values[0].value);
      })
      .then((unsubscribe) => {
        console.log('Subscribed');
        return setUnsubscribeFn(() => unsubscribe);
      });
  }

  useEffect(() => {
    return () => {
      unsubscribeFn();
    };
  }, []);
  function doUnsubscribe() {
    console.log('Called');
    unsubscribeFn();
    setUnsubscribeFn(() => () => {});
  }
  return (
    <>
      <h1>Dashboard Playground</h1>
      <div>
        <p>{metric}</p>
        <p>
          <button type="button" onClick={doSubscribe}>
            Subscribe
          </button>
          <button type="button" onClick={doUnsubscribe}>
            Unsubscribe
          </button>
          <p>Current value: {currentValue}</p>
        </p>
      </div>
    </>
  );
}

export default DashboardPlayground;
