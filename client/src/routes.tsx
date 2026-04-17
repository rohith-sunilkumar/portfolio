import { createBrowserRouter } from "react-router";
import { Root } from "./mvc/views/Root";
import { HomePage } from "./mvc/views/pages/HomePage";
import { WorkDetailPage } from "./mvc/views/pages/WorkDetailPage";
import { PlaygroundDetailPage } from "./mvc/views/pages/PlaygroundDetailPage";
import { AdminLoginPage } from "./mvc/views/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./mvc/views/pages/admin/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "work/:id", Component: WorkDetailPage },
      { path: "playground/:id", Component: PlaygroundDetailPage },
    ],
  },
  // Admin routes (outside Root layout — no custom cursor etc.)
  { path: "/admin/login", Component: AdminLoginPage },
  { path: "/admin/dashboard", Component: AdminDashboardPage },
]);
