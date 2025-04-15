// Navbar component that includes navigation links and theme toggle
import Link from 'next/link';
import { useTheme } from "../context/ThemeContext";

export default function NavBar() {
  // Access theme state and toggle function from context
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      {/* App title or logo */}
      <div className="navbar-logo">Sales Dashboard</div>

      {/* Navigation links to different pages */}
      <div className="navbar-links">
        <Link href="/">Home</Link>
        <Link href="/salesReps">Sales Reps</Link>
        <Link href="/aiPage">AI Assistant</Link>

        {/* Theme toggle switch (light/dark mode) */}
        <div className="theme-toggle">
          <label className="switch">
            {/* Toggle input checkbox */}
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === 'dark'}
            />
            {/* Custom slider style for toggle */}
            <span className="slider"></span>
          </label>

          {/* Emoji icon reflects current theme visually */}
          <span className="theme-icon">
            {theme === 'light' ? '🌞' : '🌙'}
          </span>
        </div>
      </div>
    </nav>
  );
}
