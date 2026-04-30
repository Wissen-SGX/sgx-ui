import { Suspense, lazy } from "react";
import { LoadingScreen } from "@sgx/ui";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "@sgx/query-client";
import { fetchCurrentUser } from "./api/auth.api";
import "./index.css";

const AuthApp = lazy(() =>
  import("auth/App").catch(() => ({
    default: () => <div>Auth failed to load</div>,
  })),
);

const MainApp = lazy(() =>
  import("index-studio/App").catch(() => ({
    default: () => <div>Main failed to load</div>,
  })),
);

function AppRouter() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  if (isLoading) return <LoadingScreen isFading={false} />;

  return (
    <Suspense fallback={<LoadingScreen isFading={false} />}>
      {user ? <MainApp /> : <AuthApp />}
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
