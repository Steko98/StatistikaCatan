import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { LoadingProvider } from "./components/LoadingContext.jsx";
import { ErrorProvider } from "./components/ErrorContext.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <App />            
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);
