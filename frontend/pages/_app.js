// Importing global CSS styles for various components
import '../styles/ai.css';          // Styles for the AI page
import '../styles/home.css';        // Styles for the Home page
import '../styles/salesreps.css';   // Styles for the Sales Reps page
import '../styles/navbar.css';      // Styles for the Navbar component
import '../styles/globals.css';     // Global styles applied across the app

// Importing the NavBar component to be used in the layout
import NavBar from '../components/NavBar';  

// Importing the ThemeProvider from context to manage theme state (light/dark)
import { ThemeProvider } from '../context/ThemeContext';  

// Main App component that acts as the entry point for all pages
export default function App({ Component, pageProps }) {
    return (
      // Wrap the app in the ThemeProvider to allow theme state management across the entire app
      <ThemeProvider>
        {/* Render the NavBar at the top of every page */}
        <NavBar />  
        {/* Render the main page content dynamically based on the current route */}
        <Component {...pageProps} />  
      </ThemeProvider>
    );
}
