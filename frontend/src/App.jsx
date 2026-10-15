import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import LandAssessment from "./pages/LandAssessment";
import LandParcels from "./pages/LandParcels";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ParcelDetails from "./pages/ParcelDetails";
import Recommendations from "./pages/Recommendations";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import VillageMap from "./pages/VillageMap";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
            <Route path="/map" element={<VillageMap />} />
            <Route path="/parcels" element={<LandParcels />} />
            <Route path="/parcels/:id" element={<ParcelDetails />} />
            <Route path="/assessment" element={<LandAssessment />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
