import { Link } from "react-router-dom";
import edusparkLogo from "@/assets/eduspark-logo.jpg";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300">
            <img 
              src={edusparkLogo} 
              alt="EDUSPARK Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight">
            <span className="text-primary">EDU</span>
            <span className="text-foreground">SPARK</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Powered By <span className="text-primary font-semibold">EDUSPARK</span>
          </span>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
