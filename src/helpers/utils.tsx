import { ethers, BigNumber } from 'ethers'
import React from 'react'
import { toast } from 'react-toastify'
import './toast.css'
import NumFormat from 'react-number-format'

export const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000'
export const RPC_URL: string = `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
export const RINKEBY_CHAIN_ID: number = 4
export const RINKEBY_CHAIN_ID_HEX: string = '0x4'
export const oneYear: number = 60 * 60 * 24 * 365

export const infiniteApproveValue: BigNumber = BigNumber.from(
  '1157920892373161954235709850086879078532699',
)

export const copyToClipboard = (e: any, text: string): void => {
  e.preventDefault()
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

export const makeShortAddress = (address: string): string => {
  return `${address.substr(0, 6).toString()}...${address.substr(
    address.length - 4,
    address.length,
  )}`
}

export const reloadPage = (): void => {
  window.location.reload()
}

export const addTokenToWallet = async (
  symbol: string,
  decimals: number = 18,
  address: string,
  image: string,
) => {
  try {
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image,
        },
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export const switchToRinkeby = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: RINKEBY_CHAIN_ID_HEX }],
    })
  } catch (error) {
    console.error(error)
  }
}

export const toUsd = (amount: string, price: string): number =>
  parseFloat(amount) * parseFloat(price)

export const getPriceInUsdFromPair = (
  reserves0: string,
  reservesETH: string,
  ethPrice: number,
): number => {
  const one = ethers.utils.parseEther('1')
  const amount: number = parseFloat(
    ethers.utils.formatEther(one.mul(reserves0).div(reservesETH)),
  )
  return ethPrice / amount
}

export const getEstimatedApy = async (
  rate: number,
  LPsStaked: number,
  reserves: any,
  totalSupplyPool: number,
  moonPrice: number,
  ethPrice: number,
  // @ts-ignore
): string => {
  try {
    const token0Price: number = await getPriceInUsdFromPair(
      reserves[0],
      reserves[1],
      ethPrice,
    )

    const valuePerLPToken: number =
      (token0Price * reserves[0] + ethPrice * reserves[1]) / totalSupplyPool

    const apy: number =
      ((rate * oneYear * moonPrice) / (valuePerLPToken * LPsStaked)) * 100

    if (Number.isNaN(apy)) {
      return '0.0'
    }

    return apy.toString()
  } catch (error) {
    console.error(error)
  }
}

export const tsToDateString = (ts: number): string => {
  const dt = new Date(ts * 1000)
  return dt.toLocaleDateString()
}

export const sendNotification = (
  title: string,
  body: string,
  duration: number = 3000,
  fn: () => void = () => {},
  delay: number = 0,
  className: string = '',
) => {
  const toastConstant: React.FC = (): JSX.Element => {
    return (
      <div className="">
        <h3 className="bold">{title}</h3>
        <p>{body}</p>
      </div>
    )
  }

  toast(toastConstant, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: duration,
    hideProgressBar: true,
    delay,
    className,
    onClose: () => {
      fn()
    },
  })
}

export const errorNotification = (body: string) => {
  const title = '❌ Error!'
  sendNotification(title, body, 3000, () => {}, 0, 'error')
}

export const notifyUser = async (tx: any, fn: () => void = () => {}) => {
  try {
    let notificationTitle = '⏰ Transaction Sent!'
    let notificationBody = 'Please wait for the transaction confirmation.'
    sendNotification(notificationTitle, notificationBody, 0, fn)

    await tx.wait(1)

    toast.dismiss()

    notificationTitle = '✔️ Transaction Confirmed!'
    notificationBody = 'Transaction was successful.'

    sendNotification(
      notificationTitle,
      notificationBody,
      3000,
      fn,
      1000,
      'success',
    )

    fn()
  } catch (error) {
    console.error(error)
  }
}

interface AlertProps {
  currentChainId: number
  requiredChainId: number
  alertCondition: boolean
  alertConditionHandler: () => void
  isDarkMode: boolean
}

export const SwitchToRinkebyAlert: React.FC<AlertProps> = ({
  currentChainId,
  requiredChainId,
  alertCondition,
  alertConditionHandler,
  isDarkMode,
}): any => {
  return (
    currentChainId !== requiredChainId &&
    alertCondition && (
      <div
        className={`${
          isDarkMode ? 'switch-chain-alert-dark-mode' : 'switch-chain-alert'
        }`}
      >
        <strong>
          ⚠️ Wrong network: Please switch to the{' '}
          <span onClick={switchToRinkeby} className="link switch-network-link">
            Rinkeby test network
          </span>
        </strong>
        <span className="dismiss-alert" onClick={alertConditionHandler}>
          X
        </span>
      </div>
    )
  )
}

export const Filler: React.FC = (): JSX.Element => {
  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  )
}

interface NumberFormatProps {
  value: number
  decimalScale: number
}

export const NumberFormat: React.FC<NumberFormatProps> = ({
  value,
  decimalScale,
}): JSX.Element => {
  return (
    <NumFormat
      className="number"
      value={value}
      displayType="text"
      thousandSeparator
      prefix=""
      decimalScale={decimalScale}
    />
  )
}
