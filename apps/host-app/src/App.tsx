import { Suspense, lazy, useState, useEffect } from 'react';
import './index.css';

const AuthApp = lazy(() =>
  import('auth/App').catch(() => ({
    default: () => <div>Auth failed to load</div>,
  }))
);

const MainApp = lazy(() =>
  import('index-studio/App').catch(() => ({
    default: () => <div>Main failed to load</div>,
  }))
);

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return pathname;
}

export default function App() {
  const pathname = usePathname();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-slate-600">Loading...</div>
      }
    >
      {pathname.startsWith('/auth') ? <AuthApp /> : <MainApp />}
    </Suspense>
  );
}
