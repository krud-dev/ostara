import ActuatorPlayground from 'renderer/ActuatorPlayground';
import Config from 'renderer/Config';
import { Box } from '@mui/material';
import DashboardPlayground from '../DashboardPlayground';

const Sample = () => {
  return (
    <Box sx={{ p: 4 }}>
      <ActuatorPlayground url="https://sbclient.krud.dev/actuator" />
      <hr />
      <Config />
      <hr />
      <DashboardPlayground />
    </Box>
  );
};
export default Sample;
