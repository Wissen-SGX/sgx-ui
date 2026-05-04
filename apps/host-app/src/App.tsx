import { Suspense, lazy, useEffect } from "react";
import { LoadingSpinner } from "@sgx/ui";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@sgx/query-client";
import { fetchCurrentUser } from "./api/auth.api";
import "./index.css";

const AuthApp = lazy(() =>
  import("auth/App").catch(() => ({
    default: () => <div>Auth failed to load</div>,
  })),
);

const IndexStudioApp = lazy(() =>
  import("index-studio/App").catch(() => ({
    default: () => <div>Index Studio failed to load</div>,
  })),
);

const centeredSpinner = (
  <div className="centered-spinner">
    <LoadingSpinner />
  </div>
);

function AppRouter() {
  const client = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault(); // tells auth-app the event was handled (no page reload needed)
      client.invalidateQueries({ queryKey: ["auth", "me"] });
    };
    window.addEventListener("sgx:auth-state-changed", handler);
    return () => window.removeEventListener("sgx:auth-state-changed", handler);
  }, [client]);

  if (isLoading) return centeredSpinner;

  return (
    <Suspense fallback={centeredSpinner}>
      {user ? <IndexStudioApp /> : <AuthApp />}
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
