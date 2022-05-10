import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../helpers/connector'

interface Props {
  children: React.ReactNode
}

export const ConnectContext = React.createContext({
  isConnected: false,
  chainId: 0,
  connect: () => {},
  disconnect: () => {},
  library: null,
  account: null,
  close: () => {},
})

export const ConnectProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const {
    activate,
    deactivate,
    active,
    chainId,
    library,
    account,
    connector,
  } = useWeb3React()

  const connect = async () => {
    try {
      await activate(injected)
    } catch (error) {
      console.error(error)
    }
  }
  const disconnect = async () => {
    try {
      await deactivate()
    } catch (error) {
      console.error(error)
    }
  }

  // Removes wallet from the DOM. Useful for wallets injected via iframe (e.g. Portis or WalletConnect)
  const close = () => {
    // @ts-ignore
    connector.close()
  }

  return (
    <ConnectContext.Provider
      value={{
        isConnected: active,
        // @ts-ignore
        chainId,
        connect,
        disconnect,
        library,
        // @ts-ignore
        account,
        close,
      }}
    >
      {children}
    </ConnectContext.Provider>
  )
}
