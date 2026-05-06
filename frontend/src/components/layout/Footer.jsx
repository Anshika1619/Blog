import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background mt-auto py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* ── Brand Section ── */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 group mb-5 inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold font-display text-base shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
                N
              </div>
              <span className="font-display font-semibold text-text-primary text-xl tracking-tight">
                Notivo
              </span>
            </Link>
            <p className="text-text-muted text-sm max-w-sm leading-relaxed">
              A premium space for editorial thinking and long-form writing. Express your ideas with absolute clarity.
            </p>
          </div>
          
          {/* ── Platform Links ── */}
          <div>
            <h4 className="font-display font-semibold mb-5 text-text-primary tracking-tight">Platform</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link to="/blogs" className="hover:text-primary transition-colors duration-200">Explore Stories</Link></li>
              <li><Link to="/trending" className="hover:text-primary transition-colors duration-200">Trending</Link></li>
              <li><Link to="/authors" className="hover:text-primary transition-colors duration-200">Authors</Link></li>
            </ul>
          </div>

          {/* ── Legal Links ── */}
          <div>
            <h4 className="font-display font-semibold mb-5 text-text-primary tracking-tight">Legal</h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link to="/privacy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors duration-200">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* ── Bottom Bar ── */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-text-muted">
          <p>
            © <span className="numeric">{new Date().getFullYear()}</span> Notivo. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <a href="#" className="hover:text-primary transition-colors duration-200">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Dribbble</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;