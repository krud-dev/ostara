import { createRoot } from 'react-dom/client';
import App from './App';

// CSS
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'allotment/dist/style.css';
import 'reactflow/dist/style.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
