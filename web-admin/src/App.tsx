import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import { SchoolProfile } from "./pages/SchoolProfile";
import { EditSchool } from "./pages/EditSchool";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import { Employees } from "./pages/Employees";
import { AddEmployee } from "./pages/AddEmployee";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <SchoolProfile />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "add-employee",
        element: (
          <ProtectedRoute>
            <AddEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-school",
        element: (
          <ProtectedRoute>
            <EditSchool />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;