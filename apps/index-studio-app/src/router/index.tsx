import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

// When served standalone (preview server at /index-studio/), use /index-studio/ as basename.
// When loaded as a federated module by host-app, the page URL won't start with /index-studio/.
const basename = window.location.pathname.startsWith('/index-studio/') ? '/index-studio/' : '/';

export const router = createBrowserRouter(routes, { basename });
