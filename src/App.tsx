import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Services } from './pages/Services';
import { Projects } from './pages/Projects';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ServicesManagement } from './pages/admin/ServicesManagement';
import { PortfolioManagement } from './pages/admin/PortfolioManagement';
import { TeamManagement } from './pages/admin/TeamManagement';
import { MessagesManagement } from './pages/admin/MessagesManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Landing />
              </Layout>
            }
          />

          <Route
            path="/services"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />

          <Route
            path="/projects"
            element={
              <Layout>
                <Projects />
              </Layout>
            }
          />

          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />

          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ServicesManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/portfolio"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <PortfolioManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/team"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <TeamManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <MessagesManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
