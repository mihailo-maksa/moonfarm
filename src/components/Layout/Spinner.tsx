import React, { useContext } from 'react'
import { ThemeContext } from '../../state/ThemeContext'
import spinner from '../../assets/spinner.gif'
import './layout.scss'

const Spinner: React.FC = (): JSX.Element => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div className={`${isDarkMode ? 'dark-mode-spinner' : ''}`}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <img src={spinner} alt="Spinner" className="spinner" />
      <div className="loading">Please wait...</div>
    </div>
  )
}

export default Spinner
