import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary selection:bg-primary-light selection:text-primary">
      <Navbar />
      
      {/* ── Main Content Area ── */}
      <main className="flex-grow pt-16 md:pt-20 relative flex flex-col">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;