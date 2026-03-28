import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('darkMode') === 'true'
    );

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 2. Add toggle in Navbar
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

function Navbar() {
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    return (
        <nav className="bg-white dark:bg-gray-900">
            <button onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
        </nav>
    );
}

// 3. Update tailwind.config.js
module.exports = {
    darkMode: 'class', // Enable dark mode
    // ... rest of config
}