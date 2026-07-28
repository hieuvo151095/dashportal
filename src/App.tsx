import { Navigate, Route, Routes } from 'react-router-dom'
import { DanhMucPhiChiTietPage } from './pages/DanhMucPhiChiTietPage'
import { DanhMucPhiTongHopPage } from './pages/DanhMucPhiTongHopPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { PortalShell } from './pages/PortalShell'
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
          <Route
            path="/thu-hoc-phi/tong-hop"
            element={<PlaceholderPage title="Thu Học phí — Tổng hợp toàn thành phố" />}
          />
          <Route
            path="/thu-hoc-phi/chi-tiet"
            element={<PlaceholderPage title="Thu Học phí — Chi tiết theo trường" />}
          />
          <Route
            path="/cong-no/tong-hop"
            element={<PlaceholderPage title="Công nợ Học phí — Tổng hợp toàn thành phố" />}
          />
          <Route
            path="/cong-no/chi-tiet"
            element={<PlaceholderPage title="Công nợ Học phí — Chi tiết theo trường" />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
