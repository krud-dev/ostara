import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ActuatorPlayground from './ActuatorPlayground';

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
      <ActuatorPlayground url={'http://localhost:18080/actuator'} />
      <hr />
      <div>Current value: darkMode = {JSON.stringify(value)}</div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="button" onClick={() => setRemote()}>
        Save
      </button>
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
