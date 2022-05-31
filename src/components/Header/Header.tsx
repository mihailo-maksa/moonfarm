import React, { useContext, useEffect, useState } from 'react'
import {
  makeShortAddress,
  copyToClipboard,
  RINKEBY_CHAIN_ID,
  switchToRinkeby,
} from '../../helpers/utils'
import { ConnectContext } from '../../state/ConnectContext'
import { ThemeContext } from '../../state/ThemeContext'
import './header.scss'
import logo from '../../assets/logo192.png'
import { ModeSwitcher } from '../../helpers/Icons'
import logoutIcon from '../../assets/logout.png'
import whiteLogoutIcon from '../../assets/white_logout.png'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import MenuIcon from '@material-ui/icons/Menu'
import Tooltip from 'react-bootstrap/esm/Tooltip'
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger'
import { useMediaQuery } from 'react-responsive'
import Button from 'react-bootstrap/esm/Button'
import metamaskIcon from '../../assets/metamask.svg'

const Header: React.FC = (): JSX.Element => {
  const { connect, disconnect, isConnected, account, chainId } = useContext(
    ConnectContext,
  )
  const { isDarkMode, switchMode } = useContext(ThemeContext)
  const [saveAccountTracker, setSaveAccountTracker] = useState<boolean>(false)
  const mobileHeader = useMediaQuery({ query: '(max-width: 992px)' })

  if (saveAccountTracker && account) {
    localStorage.setItem('account', JSON.stringify(account))
    setSaveAccountTracker(false)
  }

  if (chainId !== RINKEBY_CHAIN_ID) {
    switchToRinkeby()
  }

  useEffect(() => {
    const main = async () => {
      try {
        window.addEventListener('load', async () => {
          // @ts-ignore
          if (JSON.parse(localStorage.getItem('account'))) {
            await connect()
          }
        })
      } catch (error) {
        console.error(error)
      }
    }

    main()
  }, [connect])

  const useStyles = makeStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  })

  const SwipeableTemporaryDrawer: React.FC = (): JSX.Element => {
    const classes = useStyles()
    const [state, setState] = useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
    })

    const toggleDrawer = (anchor: string, open: boolean) => (event: any) => {
      if (
        event &&
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
    }

    const list = (anchor: string) => (
      <>
        <div
          className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
          style={{
            backgroundColor: isDarkMode ? '#191b1f' : '',
            paddingBottom: isDarkMode && mobileHeader ? '250vw' : '',
          }}
        >
          <List className="mobile-menu">
            <div className="app-nav mr-5">
              <div className="nav-links">
                <Link
                  to="/"
                  className={`nav-link ${
                    isDarkMode ? 'nav-link-dark-mode' : ''
                  }`}
                >
                  <i className="fas fa-tractor" />{' '}
                  <span className="nav-link-name ml-1">Farms</span>
                </Link>
                <Link
                  to="/faucet"
                  className={`nav-link ${
                    isDarkMode ? 'nav-link-dark-mode' : ''
                  }`}
                >
                  <i className="fas fa-shower" />{' '}
                  <span className="nav-link-name ml-1">Faucet</span>
                </Link>
              </div>
            </div>
          </List>
          <div className="mode-switcher-mobile">
            <ModeSwitcher
              isDarkMode={isDarkMode}
              switchTheme={switchMode}
              className="bold"
            />
          </div>
          {isConnected ? (
            <span className="header-address">
              <h4
                style={{
                  marginRight: '15px',
                  marginLeft: '22px',
                  color: '#007bff',
                  display: 'inline',
                  marginTop: '20px',
                }}
                className="header-address"
              >
                <OverlayTrigger
                  key="bottom"
                  placement="bottom"
                  // @ts-ignore
                  className="header-addresss"
                  overlay={
                    <Tooltip
                      id="tooltip-bottom"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Click to Copy
                    </Tooltip>
                  }
                >
                  <a
                    href="/"
                    // @ts-ignore
                    onClick={(e) => copyToClipboard(e, account)}
                    className="header-address"
                  >
                    <span
                      style={{
                        textDecoration: 'underline',
                      }}
                    >
                      {/* @ts-ignore */}
                      {makeShortAddress(account)}
                    </span>
                  </a>
                </OverlayTrigger>
              </h4>
              <Link
                to=""
                onClick={() => {
                  disconnect()
                  localStorage.removeItem('account')
                }}
                className="pointer mobile-logout"
              >
                <img
                  alt="Logout"
                  src={isDarkMode ? whiteLogoutIcon : logoutIcon}
                  width={isDarkMode ? 30 : 37}
                  height={isDarkMode ? 30 : 37}
                />
              </Link>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                connect()
                setSaveAccountTracker(true)
              }}
              className={'btn btn-primary bold mr-4 connect-btn-mobile'}
            >
              <img
                src={metamaskIcon}
                alt="MetaMask Icon"
                className="metamask-icon-btn"
              />{' '}
              Connect Wallet
            </button>
          )}
        </div>
      </>
    )

    const styles = {
      largeIcon: {
        width: 35,
        height: 35,
        position: 'relative',
        bottom: 3,
      },
    }

    return (
      <div>
        {['right'].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button
              style={{
                backgroundColor: isDarkMode ? '#191b1f' : '#fafbfd',
                color: isDarkMode ? '#fff' : '#000',
              }}
              onClick={toggleDrawer(anchor, true)}
            >
              {/* @ts-ignore */}
              <MenuIcon style={styles.largeIcon} className="menu-icon mr-4" />
            </Button>
            <SwipeableDrawer
              anchor={'right'}
              // @ts-ignore
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              {list(anchor)}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className={`app-header ${isDarkMode ? 'app-header-dark-mode' : ''}`}>
      {mobileHeader ? (
        <React.Fragment>
          <div className="app-logo ml-5">
            <Link to="/">
              <img src={logo} alt="Logo" width={50} height={50} />
            </Link>
            <Link to="/">
              <h1
                className={`${
                  isDarkMode ? 'app-title-dark-mode' : 'app-title'
                } bold`}
              >
                MoonFarm
              </h1>
            </Link>
          </div>
          <SwipeableTemporaryDrawer />
        </React.Fragment>
      ) : (
        <>
          <div className="app-logo ml-5">
            <Link to="/">
              <img src={logo} alt="Logo" width={50} height={50} />
            </Link>
            <Link to="/">
              <h1
                className={`${
                  isDarkMode ? 'app-title-dark-mode' : 'app-title'
                } bold`}
              >
                MoonFarm
              </h1>
            </Link>
          </div>

          <div
            className={`app-nav mr-5 ${isDarkMode ? 'app-nav-dark-mode' : ''}`}
          >
            <div className="nav-links">
              <Link
                to="/"
                className={`nav-link ${isDarkMode ? 'nav-link-dark-mode' : ''}`}
              >
                <i className="fas fa-tractor" />{' '}
                <span className="nav-link-name ml-1">Farms</span>
              </Link>
              <Link
                to="/faucet"
                className={`nav-link ${isDarkMode ? 'nav-link-dark-mode' : ''}`}
              >
                <i className="fas fa-shower" />{' '}
                <span className="nav-link-name ml-1">Faucet</span>
              </Link>
            </div>
            <div className="app-mode-icon mr-3 bold">
              <ModeSwitcher
                className="bold"
                isDarkMode={isDarkMode}
                switchTheme={switchMode}
              />
            </div>
            <div className="app-account">
              {isConnected ? (
                <div className="user-address">
                  <OverlayTrigger
                    key="bottom"
                    placement="bottom"
                    // @ts-ignore
                    className="header-addresss mr-3"
                    overlay={
                      <Tooltip
                        id="tooltip-bottom"
                        style={{
                          fontWeight: 'bold',
                        }}
                      >
                        Click to Copy
                      </Tooltip>
                    }
                  >
                    <a
                      href="/"
                      // @ts-ignore
                      onClick={(e) => copyToClipboard(e, account)}
                      className="header-address mr-3"
                      style={{
                        color: '#007bff',
                        marginTop: '30px',
                        textDecoration: 'underline',
                      }}
                    >
                      <span
                        style={{
                          textDecoration: 'underline',
                        }}
                      >
                        {/* @ts-ignore */}
                        {makeShortAddress(account)}
                      </span>
                    </a>
                  </OverlayTrigger>
                  <Link
                    to=""
                    onClick={() => {
                      disconnect()
                      localStorage.removeItem('account')
                    }}
                    className="pointer ml-1"
                  >
                    <img
                      alt="Logout"
                      src={isDarkMode ? whiteLogoutIcon : logoutIcon}
                      width={isDarkMode ? 30 : 37}
                      height={isDarkMode ? 30 : 37}
                    />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    connect()
                    setSaveAccountTracker(true)
                  }}
                  className={'btn btn-primary bold mr-4'}
                >
                  <img
                    src={metamaskIcon}
                    alt="MetaMask Icon"
                    className="metamask-icon-btn"
                  />{' '}
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Header
