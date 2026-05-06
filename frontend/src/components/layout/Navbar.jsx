import { Link, useNavigate } from 'react-router-dom';
import { PenSquare, LogOut, User as UserIcon } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold font-display text-lg shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            N
          </div>
          <span className="font-display font-semibold text-xl tracking-tight text-text-primary group-hover:text-primary transition-colors duration-200">
            Notivo
          </span>
        </Link>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/blogs" className="text-sm font-medium text-text-muted hover:text-primary transition-colors duration-200 hidden sm:block mr-2">
            Stories
          </Link>
          
          {isAuthenticated ? (
            <>
              {/* Write Button */}
              <Link to="/write">
                <Button variant="ghost" size="sm" className="gap-2 text-text-secondary hover:text-primary hover:bg-primary-light">
                  <PenSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>
              
              <div className="h-5 w-px bg-border mx-1" />
              
              {/* Profile / Dashboard */}
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-display font-bold text-sm">
                      {user?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                    </div>
                  )}
                </Button>
              </Link>

              {/* Logout */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="text-text-muted hover:text-red-600 hover:bg-red-50"
                title="Log out"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </Button>
            </>
          ) : (
            <>
              <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-medium text-text-secondary hover:text-text-primary">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="shadow-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;