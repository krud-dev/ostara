import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ActuatorPlayground from './ActuatorPlayground';
import Config from './Config';

const Sample = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<object>();
  function refreshValue() {
    setValue(window.electron.configurationStore.get('darkMode'));
  }

  function setRemote() {
    window.electron.configurationStore.set('darkMode', inputValue);
    refreshValue();
  }

  useEffect(() => {
    refreshValue();
  }, []);

  return (
    <div>
      <ActuatorPlayground url="https://sbclient.krud.dev/actuator" />
      <hr />
      <Config />
    </div>
  );
};
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sample />} />
      </Routes>
    </Router>
  );
}
