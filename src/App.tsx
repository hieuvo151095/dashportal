import { Navigate, Route, Routes } from 'react-router-dom'
import { CongNoChiTietPage } from './pages/CongNoChiTietPage'
import { CongNoTongHopPage } from './pages/CongNoTongHopPage'
import { DanhMucPhiChiTietPage } from './pages/DanhMucPhiChiTietPage'
import { DanhMucPhiTongHopPage } from './pages/DanhMucPhiTongHopPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PortalShell } from './pages/PortalShell'
import { ThietLapPage } from './pages/ThietLapPage'
import { ThuHocPhiChiTietPage } from './pages/ThuHocPhiChiTietPage'
import { ThuHocPhiTongHopPage } from './pages/ThuHocPhiTongHopPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<PortalShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/danh-muc-phi/tong-hop" element={<DanhMucPhiTongHopPage />} />
          <Route path="/danh-muc-phi/chi-tiet" element={<DanhMucPhiChiTietPage />} />
          <Route path="/thu-hoc-phi/tong-hop" element={<ThuHocPhiTongHopPage />} />
          <Route path="/thu-hoc-phi/chi-tiet" element={<ThuHocPhiChiTietPage />} />
          <Route path="/cong-no/tong-hop" element={<CongNoTongHopPage />} />
          <Route path="/cong-no/chi-tiet" element={<CongNoChiTietPage />} />
          <Route path="/thiet-lap" element={<ThietLapPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
