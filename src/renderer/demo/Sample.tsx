import ActuatorPlayground from 'renderer/ActuatorPlayground';
import Config from 'renderer/Config';

const Sample = () => {
  return (
    <div>
      <ActuatorPlayground url="https://sbclient.krud.dev/actuator" />
      <hr />
      <Config />
    </div>
  );
};
export default Sample;
