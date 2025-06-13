import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex items-center outline-0 focus:outline-0 w-16 h-8 p-1 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-blue-500 hover:border-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >


      <motion.div
        initial={false}
        animate={isDark ? 'dark' : 'light'}
        variants={{
          light: { x: -12, backgroundColor: '#FACC15' },
          dark: { x: 12, backgroundColor: '#1E3A8A' }
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-6 h-6 rounded-full shadow-lg z-10 flex items-center justify-center text-white"
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.div>
    </button>
  );
}