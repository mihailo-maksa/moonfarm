import React, { useContext, useState, useEffect } from 'react'
import { ConnectContext } from '../../state/ConnectContext'
import { ThemeContext } from '../../state/ThemeContext'
import { getContract } from '../../helpers/contract'
import {
  addTokenToWallet,
  notifyUser,
  errorNotification,
  Filler,
  RINKEBY_CHAIN_ID,
  SwitchToRinkebyAlert,
} from '../../helpers/utils'
import contracts from '../../contracts/contracts.json'
import ERC20 from '../../contracts/ERC20.json'
import WETH from '../../contracts/WETH.json'
import { ethers } from 'ethers'
import './faucet.scss'
import metamaskIcon from '../../assets/metamask.svg'

const Faucet: React.FC = (): JSX.Element => {
  const { isDarkMode } = useContext(ThemeContext)
  const { library, account } = useContext(ConnectContext)

  const [networkWarning, setNetworkWarning] = useState<boolean>(true)
  const [currentChainId, setCurrentChainId] = useState<number>(0)

  useEffect(() => {
    const main = async () => {
      try {
        // @ts-ignore
        const { chainId: chain_id } = await new ethers.providers.Web3Provider(
          window.ethereum,
        ).getNetwork()

        setCurrentChainId(chain_id)
      } catch (error) {
        console.error(error)
      }
    }

    main()
  }, [])

  const mintWeth = async () => {
    try {
      const weth = await getContract(
        library,
        account,
        contracts.contracts.WETH.address,
        WETH.abi,
      )

      const tx = await weth.deposit({ value: ethers.utils.parseEther('0.1') })

      notifyUser(tx)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature')
      } else {
        errorNotification(
          'Failed to mint WETH. Make sure your wallet balance is at least 0.1 ETH',
        )
      }
    }
  }

  const mintDai = async () => {
    try {
      const dai = await getContract(
        library,
        account,
        contracts.contracts.DAI.address,
        ERC20.abi,
      )

      const tx = await dai.mint(account, ethers.utils.parseEther('1000'))

      notifyUser(tx)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature')
      } else {
        errorNotification('Failed to mint DAI')
      }
    }
  }

  const mintUsdc = async () => {
    try {
      const usdc = await getContract(
        library,
        account,
        contracts.contracts.USDC.address,
        ERC20.abi,
      )

      const tx = await usdc.mint(account, ethers.utils.parseEther('1000'))

      notifyUser(tx)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature')
      } else {
        errorNotification('Failed to mint USDC')
      }
    }
  }

  const mintWbtc = async () => {
    try {
      const wbtc = await getContract(
        library,
        account,
        contracts.contracts.WBTC.address,
        ERC20.abi,
      )

      const tx = await wbtc.mint(account, ethers.utils.parseEther('0.1'))

      notifyUser(tx)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature')
      } else {
        errorNotification('Failed to mint WBTC')
      }
    }
  }

  const addWeth = async () => {
    try {
      await addTokenToWallet(
        'WETH',
        18,
        contracts.contracts.WETH.address,
        'https://raw.githubusercontent.com/mihailo-maksa/moonfarm/master/src/assets/weth.png',
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addDai = async () => {
    try {
      await addTokenToWallet(
        'DAI',
        18,
        contracts.contracts.DAI.address,
        'https://raw.githubusercontent.com/mihailo-maksa/moonfarm/master/src/assets/dai.png',
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addUsdc = async () => {
    try {
      await addTokenToWallet(
        'USDC',
        6,
        contracts.contracts.USDC.address,
        'https://raw.githubusercontent.com/mihailo-maksa/moonfarm/master/src/assets/usdc.png',
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addWbtc = async () => {
    try {
      await addTokenToWallet(
        'WBTC',
        18,
        contracts.contracts.WBTC.address,
        'https://raw.githubusercontent.com/mihailo-maksa/moonfarm/master/src/assets/wbtc.png',
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addMoon = async () => {
    try {
      await addTokenToWallet(
        'MOON',
        18,
        contracts.contracts.MOON.address,
        'https://raw.githubusercontent.com/mihailo-maksa/moonfarm/master/src/assets/logo192.png',
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={`${isDarkMode ? 'faucet-dark-mode faucet' : 'faucet'}`}>
      <Filler />
      <SwitchToRinkebyAlert
        currentChainId={currentChainId}
        requiredChainId={RINKEBY_CHAIN_ID}
        alertCondition={networkWarning}
        alertConditionHandler={() => setNetworkWarning(false)}
        isDarkMode={isDarkMode}
      />

      <h1 className="faucet-title bold">MoonFarm Faucet</h1>

      <div className="faucet-header-buttons">
        <div className="faucet-button-group">
          <button className="btn btn-secondary btn-link" type="button">
            <a
              href="https://faucet.rinkeby.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="bold"
            >
              Get Rinkeby ETH
            </a>
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={addMoon}
          >
            <img
              src={metamaskIcon}
              alt="MetaMask Icon"
              className="metamask-icon-btn"
            />{' '}
            Add MOON to MetaMask
          </button>
        </div>
      </div>

      <br />
      <br />

      <div className="faucet-content">
        <div className="faucet-button-group">
          <button className="btn btn-secondary btn-link" type="button">
            <a
              href={`https://app.sushi.com/swap?inputCurrency=${contracts.contracts.WETH.address}&outputCurrency=${contracts.contracts.MOON.address}&chainId=4`}
              target="_blank"
              rel="noopener noreferrer"
              className="bold"
            >
              Buy MOON with WETH
            </a>
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={mintWeth}
          >
            Mint 0.1 WETH
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={addWeth}
          >
            <img
              src={metamaskIcon}
              alt="MetaMask Icon"
              className="metamask-icon-btn"
            />{' '}
            Add WETH to MetaMask
          </button>
        </div>

        <div className="faucet-button-group">
          <button className="btn btn-secondary btn-link" type="button">
            <a
              href={`https://app.sushi.com/swap?inputCurrency=${contracts.contracts.DAI.address}&outputCurrency=${contracts.contracts.MOON.address}&chainId=4`}
              target="_blank"
              rel="noopener noreferrer"
              className="bold"
            >
              Buy MOON with DAI
            </a>
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={mintDai}
          >
            Mint 1000 DAI
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={addDai}
          >
            <img
              src={metamaskIcon}
              alt="MetaMask Icon"
              className="metamask-icon-btn"
            />{' '}
            Add DAI to MetaMask
          </button>
        </div>

        <div className="faucet-button-group">
          <button className="btn btn-secondary btn-link" type="button">
            <a
              href={`https://app.sushi.com/swap?inputCurrency=${contracts.contracts.USDC.address}&outputCurrency=${contracts.contracts.MOON.address}&chainId=4`}
              target="_blank"
              rel="noopener noreferrer"
              className="bold"
            >
              Buy MOON with USDC
            </a>
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={mintUsdc}
          >
            Mint 1000 USDC
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={addUsdc}
          >
            <img
              src={metamaskIcon}
              alt="MetaMask Icon"
              className="metamask-icon-btn"
            />{' '}
            Add USDC to MetaMask
          </button>
        </div>

        <div className="faucet-button-group">
          <button className="btn btn-secondary btn-link" type="button">
            <a
              href={`https://app.sushi.com/swap?inputCurrency=${contracts.contracts.WBTC.address}&outputCurrency=${contracts.contracts.MOON.address}&chainId=4`}
              target="_blank"
              rel="noopener noreferrer"
              className="bold"
            >
              Buy Moon with WBTC
            </a>
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={mintWbtc}
          >
            Mint 0.1 WBTC
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={addWbtc}
          >
            <img
              src={metamaskIcon}
              alt="MetaMask Icon"
              className="metamask-icon-btn"
            />{' '}
            Add WBTC to MetaMask
          </button>
        </div>
      </div>
    </div>
  )
}

export default Faucet
