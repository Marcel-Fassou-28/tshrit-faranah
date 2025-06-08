import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Logout from "./components/pages/Logout";
import ProtectedRoute from './components/ProtectedRoute';
import DashboardContainer from './components/pages/dashbard/DashboardContainer';
import Panier from "./components/pages/cart/Panier";
import Category from "./components/pages/category/Category";
import Product from "./components/pages/category/Product";
import DashboardProduct from "./components/pages/dashbard/admin/DashboardProduct";
import DashboardCommandes from "./components/pages/dashbard/admin/DashboardCommandes";
import DashboardUsers from "./components/pages/dashbard/admin/DashboardUsers";
import ForgotPassword from "./components/pages/ForgotPassword";
import DashboardCategory from "./components/pages/dashbard/admin/DashboardCategory";
import About from "./components/pages/Terms/About";
import TermsConditions from "./components/pages/Terms/TermsConditions";

function App() {
  
  return (
    <div className="min-h-screen bg-white relative overflow-hidden text-black">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(254,175,48,0.5)_0%,rgba(255,255,255,1)_45%,rgba(255,255,255,1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/categories/:category/:id" element={<Category />} />
          <Route path="/categories/:category/:id/:product" element={<Product/>} />

          {/* Routes communes */}
          <Route
            path="/:role/dashboard/:id/:name"
            element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardContainer />
            </ProtectedRoute> } 
          />

          {/* Pour l'admin */}
          <Route path="/admin/dashboard/:id/:name/commandes" element={<ProtectedRoute allowedRoles={['admin']}><DashboardCommandes /></ProtectedRoute> } />
          <Route path="/admin/dashboard/:id/:name/utilisateurs" element={<ProtectedRoute allowedRoles={['admin']}><DashboardUsers /></ProtectedRoute> } />
           {/* Manage Product */}
           <Route path="/admin/dashboard/:id/:name/produits" element={<ProtectedRoute allowedRoles={['admin']}><DashboardProduct /></ProtectedRoute> } />
           <Route path="/admin/dashboard/:id/:name/categories" element={<ProtectedRoute allowedRoles={['admin']}><DashboardCategory /></ProtectedRoute> } />

          <Route path="/client/panier" element={<Panier /> } />
          <Route path="/logout" element={<ProtectedRoute allowedRoles={['client', 'admin']}><Logout /></ProtectedRoute>} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/termes-et-conditions" element={<TermsConditions />} />
        </Routes>
        <Footer />
      </div>
    </div>

  )
}

export default App
