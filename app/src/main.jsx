import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { initStorage } from "./utils/initStorage";
import { AppProvider } from "./context/AppContext";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout.jsx";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Auth/Login.jsx";
import DesignSystem from "./components/DesignSystem/DesignSystem.jsx";
import MatchesList from "./components/Matches/MatchesList.jsx";
import ChatWindow from "./components/Messages/ChatWindow.jsx";
import MessagesPage from "./components/Messages/MessagesPage.jsx";
import BrowsePage from "./components/Browse/BrowsePage.tsx";
import Register from "./components/Auth/Register.jsx";
import MyProfile from "./components/MyProfile/MyProfile.tsx";
import PublicProfile from "./components/PublicProfile/PublicProfile.tsx";
import "./main.css";
function Placeholder({ name }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <p className="text-2xl">🚧</p>
      <p className="text-lg font-medium mt-2">{name} — coming soon</p>
    </div>
  );
}
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
initStorage();
const router = createBrowserRouter([
  // Public routes — OUTSIDE Layout, no navbar
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Protected routes — INSIDE Layout, has navbar
  {
    element: <Layout />,
    children: [
      {
        path: "/browse",
        element: (
          <ProtectedRoute>
            <BrowsePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/matches",
        element: (
          <ProtectedRoute>
            <MatchesList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/messages",
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/messages/:userId",
        element: (
          <ProtectedRoute>
            <ChatWindow />
         
          </ProtectedRoute>
        ),
      },
      {
        path: "feed",
        element: (
          <ProtectedRoute>
            <Placeholder name="Feed" />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/me",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoute>
            <PublicProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/design",
        element: <DesignSystem />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
