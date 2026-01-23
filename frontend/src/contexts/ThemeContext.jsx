import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Fonction pour obtenir le thème initial
  const getInitialTheme = () => {
    // 1. Vérifier si un thème est stocké dans localStorage
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      return storedTheme
    }

    // 2. Sinon, utiliser la préférence système
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    // 3. Par défaut, thème clair
    return 'light'
  }

  const [theme, setTheme] = useState(getInitialTheme)

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  // Écouter les changements de préférence système (optionnel)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      // Ne changer que si l'utilisateur n'a pas défini de préférence manuelle
      const storedTheme = localStorage.getItem('theme')
      if (!storedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    // Écouter les changements
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
