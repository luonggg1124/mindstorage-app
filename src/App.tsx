//import { useState } from "react";
//import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { RouterProvider } from "react-router";
import routes from "./routes";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function App() {
  //const [greetMsg, setGreetMsg] = useState("");
  //const [name, setName] = useState("");

  //async function greet() {
  //  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //  setGreetMsg(await invoke("greet", { name }));
  //}
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching to prevent double API calls
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            // Keep staleTime to prevent unnecessary refetches
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );
  return <QueryClientProvider client={queryClient}>
    <RouterProvider router={routes} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>;
}

export default App;