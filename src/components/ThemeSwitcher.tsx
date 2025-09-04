import { useTheme } from '../contexts/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-black focus:ring-red-500 dark:focus:ring-red-600 cursor-pointer"
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
            {theme === 'light' ? (
                <Moon className="h-6 w-6" />
            ) : (
                <Sun className="h-6 w-6" />
            )}
        </button>
    );
}