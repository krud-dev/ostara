import { ActuatorClient, ActuatorHealth } from './actuatorClient';

const clazz = new ActuatorClient('http://localhost:18080/actuator');
// eslint-disable-next-line promise/always-return,promise/catch-or-return
clazz.health().then((health: ActuatorHealth) => {
  console.log(health);
});
