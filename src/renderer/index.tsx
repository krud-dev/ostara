import { createRoot } from 'react-dom/client';
import App from './App';
import * as Sentry from '@sentry/electron';

// CSS
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'reactflow/dist/style.css';
import 'allotment/dist/style.css';

if (window.configurationStore.isErrorReportingEnabled()) {
  Sentry.init({ dsn: 'https://d28c9ac8891348d0926af5d2b8454988@o4504882077302784.ingest.sentry.io/4504882079531008' });
  Sentry.setTag('boost.type', 'electron.renderer');
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
