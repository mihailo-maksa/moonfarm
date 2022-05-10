import React, { useContext } from 'react'
import { ConnectContext } from '../../state/ConnectContext'
import { ThemeContext } from '../../state/ThemeContext'
import { getContract } from '../../helpers/contract'
import {
  addTokenToWallet,
  notifyUser,
  errorNotification,
  Filler,
} from '../../helpers/utils'
import contracts from '../../contracts/contracts.json'
import ERC20 from '../../contracts/ERC20.json'
import WETH from '../../contracts/WETH.json'
import { ethers } from 'ethers'
import './faucet.scss'

const Faucet: React.FC = (): JSX.Element => {
  const { isDarkMode } = useContext(ThemeContext)
  const { library, account } = useContext(ConnectContext)

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

  const addWeth = async () => {
    try {
      await addTokenToWallet(
        'WETH',
        18,
        contracts.contracts.WETH.address,
        'https:://coingecko.com',
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
        'https:://coingecko.com',
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
        'https:://coingecko.com',
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
        'https:://coingecko.com',
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addXMoon = async () => {
    try {
      await addTokenToWallet(
        'WETH',
        18,
        contracts.contracts.xMOON.address,
        'https:://coingecko.com',
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={`${isDarkMode ? 'faucet-dark-mode faucet' : 'faucet'}`}>
      <Filler />

      <h1 className="faucet-title bold">MoonFarm Faucet</h1>

      <div className="faucet-content">
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
            Add MOON to MetaMask
          </button>
          <button
            className="btn btn-primary bold"
            type="button"
            onClick={addXMoon}
          >
            Add xMOON to MetaMask
          </button>
        </div>

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
            Add USDC to MetaMask
          </button>
        </div>
      </div>
    </div>
  )
}

export default Faucet
