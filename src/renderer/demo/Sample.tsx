import ActuatorPlayground from 'renderer/ActuatorPlayground';
import { Box } from '@mui/material';
import DashboardPlayground from '../DashboardPlayground';

const Sample = () => {
  return (
    <Box>
      <ActuatorPlayground url="https://sbclient.krud.dev/actuator" />
      <hr />
      <DashboardPlayground />
    </Box>
  );
};
export default Sample;
