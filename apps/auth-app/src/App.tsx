import { Button } from '@sgx/ui';
import './index.css';

export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <Button variant="primary">Auth App</Button>
        <p className="text-sm text-sgx-green">
          This is a simple authentication app using React and TypeScript.
        </p>
      </div>
    </main>
  );
}
