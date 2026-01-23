import { useTheme } from '../../contexts/ThemeContext'
import './ThemeToggle.scss'

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Basculer vers le thème ${isDark ? 'clair' : 'sombre'}`}
      title={`Thème actuel: ${isDark ? 'sombre' : 'clair'}`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle__text">
        {isDark ? 'Clair' : 'Sombre'}
      </span>
    </button>
  )
}

export default ThemeToggle
