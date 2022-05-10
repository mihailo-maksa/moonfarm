import React, { useContext } from 'react'
import { ThemeContext } from '../../state/ThemeContext'
import { Link } from 'react-router-dom'
import './layout.scss'

const NotFound: React.FC = (): JSX.Element => {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div>
      <div className={isDarkMode ? 'not-found-dark-mode' : 'not-found'}>
        <div className="content-404">
          <h1
            className={`${
              isDarkMode ? 'title-404-dark-mode' : 'title-404'
            } bold text-center`}
          >
            Oops!
          </h1>
          <p
            className={`desc-404 ${
              isDarkMode ? 'text-muted-dark-mode' : 'text-muted'
            } text-center`}
          >
            We couldn't find the page...
          </p>

          <button
            className="btn regular-btn bold border-rad-05 back-to-vaults-btn"
            type="button"
            style={{
              marginLeft: '10px',
            }}
          >
            <Link
              to="/"
              className="btn-link"
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.175rem',
              }}
            >
              ↩ Back to Homepage
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
