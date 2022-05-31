import React, { useContext, useEffect, useState } from 'react'
import { getContract } from '../../helpers/contract'
import contracts from '../../contracts/contracts.json'
import UniV2Pair from '../../contracts/UniV2Pair.json'
import {
  SwitchToRinkebyAlert,
  Filler,
  notifyUser,
  errorNotification,
  RINKEBY_CHAIN_ID,
  NumberFormat,
  RPC_URL,
} from '../../helpers/utils'
import { ConnectContext } from '../../state/ConnectContext'
import { ThemeContext } from '../../state/ThemeContext'
import './vaults.scss'
import { ethers } from 'ethers'
import moon from '../../assets/logo192.png'
import weth from '../../assets/eth.png'
import dai from '../../assets/dai.png'
import usdc from '../../assets/usdc.png'
import wbtc from '../../assets/wbtc.png'

const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

const Vaults: React.FC = (): JSX.Element => {
  const { isDarkMode } = useContext(ThemeContext)
  const { library, account, isConnected } = useContext(ConnectContext)

  const [networkWarning, setNetworkWarning] = useState<boolean>(true)
  const [currentChainId, setCurrentChainId] = useState<number>(0)

  const [wethBalance, setWethBalance] = useState<string>('0.00')
  const [daiBalance, setDaiBalance] = useState<string>('0.00')
  const [usdcBalance, setUsdcBalance] = useState<string>('0.00')
  const [wbtcBalance, setWbtcBalance] = useState<string>('0.00')

  const [wethBalanceStaked, setWethBalanceStaked] = useState<string>('0.00')
  const [daiBalanceStaked, setDaiBalanceStaked] = useState<string>('0.00')
  const [usdcBalanceStaked, setUsdcBalanceStaked] = useState<string>('0.00')
  const [wbtcBalanceStaked, setWbtcBalanceStaked] = useState<string>('0.00')

  const [wethLPToStake, setWethLPToStake] = useState<string>('0.00')
  const [daiLPToStake, setDaiLPToStake] = useState<string>('0.00')
  const [usdcLPToStake, setUsdcLPToStake] = useState<string>('0.00')
  const [wbtcLPToStake, setWbtcLPToStake] = useState<string>('0.00')

  const [wethApproved, setWethApproved] = useState<boolean>(false)
  const [daiApproved, setDaiApproved] = useState<boolean>(false)
  const [usdcApproved, setUsdcApproved] = useState<boolean>(false)
  const [wbtcApproved, setWbtcApproved] = useState<boolean>(false)

  useEffect(() => {
    const main = async () => {
      try {
        // @ts-ignore
        const { chainId: chain_id } = await new ethers.providers.Web3Provider(
          window.ethereum,
        ).getNetwork()

        setCurrentChainId(chain_id)

        const weth = await getContract(
          provider,
          account,
          contracts.contracts.WETHMOONLP.address,
          UniV2Pair.abi,
        )
        const dai = await getContract(
          provider,
          account,
          contracts.contracts.DAIMOONLP.address,
          UniV2Pair.abi,
        )
        const usdc = await getContract(
          provider,
          account,
          contracts.contracts.USDCMOONLP.address,
          UniV2Pair.abi,
        )
        const wbtc = await getContract(
          provider,
          account,
          contracts.contracts.WBTCMOONLP.address,
          UniV2Pair.abi,
        )

        const wethBalance = await weth.balanceOf(account)
        const daiBalance = await dai.balanceOf(account)
        const usdcBalance = await usdc.balanceOf(account)
        const wbtcBalance = await wbtc.balanceOf(account)

        setWethBalance(ethers.utils.formatEther(wethBalance.toString()))
        setDaiBalance(ethers.utils.formatEther(daiBalance.toString()))
        setUsdcBalance(ethers.utils.formatEther(usdcBalance.toString()))
        setWbtcBalance(ethers.utils.formatEther(wbtcBalance.toString()))

        const wethAllowance = await weth.allowance(
          account,
          contracts.contracts.WETHFarm.address,
        )
        const daiAllowance = await dai.allowance(
          account,
          contracts.contracts.DAIFarm.address,
        )
        const usdcAllowance = await usdc.allowance(
          account,
          contracts.contracts.USDCFarm.address,
        )
        const wbtcAllowance = await wbtc.allowance(
          account,
          contracts.contracts.WBTCFarm.address,
        )

        if (wethAllowance > 0) {
          setWethApproved(true)
        }

        if (daiAllowance > 0) {
          setDaiApproved(true)
        }

        if (usdcAllowance > 0) {
          setUsdcApproved(true)
        }

        if (wbtcAllowance > 0) {
          setWbtcApproved(true)
        }

        const wethFarm = await getContract(
          provider,
          account,
          contracts.contracts.WETHFarm.address,
          contracts.contracts.WETHFarm.abi,
        )
        const daiFarm = await getContract(
          provider,
          account,
          contracts.contracts.DAIFarm.address,
          contracts.contracts.DAIFarm.abi,
        )
        const usdcFarm = await getContract(
          provider,
          account,
          contracts.contracts.USDCFarm.address,
          contracts.contracts.USDCFarm.abi,
        )
        const wbtcFarm = await getContract(
          provider,
          account,
          contracts.contracts.WBTCFarm.address,
          contracts.contracts.WBTCFarm.abi,
        )

        const _wethBalanceStaked = await wethFarm.balanceOf(account)
        const _daiBalanceStaked = await daiFarm.balanceOf(account)
        const _usdcBalanceStaked = await usdcFarm.balanceOf(account)
        const _wbtcBalanceStaked = await wbtcFarm.balanceOf(account)

        setWethBalanceStaked(
          ethers.utils.formatEther(_wethBalanceStaked.toString()),
        )
        setDaiBalanceStaked(
          ethers.utils.formatEther(_daiBalanceStaked.toString()),
        )
        setUsdcBalanceStaked(
          ethers.utils.formatEther(_usdcBalanceStaked.toString()),
        )
        setWbtcBalanceStaked(
          ethers.utils.formatEther(_wbtcBalanceStaked.toString()),
        )
      } catch (error) {
        console.error(error)
      }
    }

    main()
  }, [account])

  const getLPTokenContractAddress = (token: string): string => {
    switch (token) {
      case 'weth':
        return contracts.contracts.WETHMOONLP.address
      case 'dai':
        return contracts.contracts.DAIMOONLP.address
      case 'usdc':
        return contracts.contracts.USDCMOONLP.address
      case 'wbtc':
        return contracts.contracts.WBTCMOONLP.address
      default:
        return ''
    }
  }

  const getFarmContractAddress = (token: string): string => {
    switch (token) {
      case 'weth':
        return contracts.contracts.WETHFarm.address
      case 'dai':
        return contracts.contracts.DAIFarm.address
      case 'usdc':
        return contracts.contracts.USDCFarm.address
      case 'wbtc':
        return contracts.contracts.WBTCFarm.address
      default:
        return ''
    }
  }

  const approveToken = async (token: string) => {
    try {
      const tokenToApprove = await getContract(
        library,
        account,
        getLPTokenContractAddress(token),
        UniV2Pair.abi,
      )

      const tx = await tokenToApprove.approve(
        getFarmContractAddress(token),
        ethers.constants.MaxUint256,
      )

      notifyUser(tx)

      await tx.wait()

      switch (token) {
        case 'weth':
          setWethApproved(true)
          break
        case 'dai':
          setDaiApproved(true)
          break
        case 'usdc':
          setUsdcApproved(true)
          break
        case 'wbtc':
          setWbtcApproved(true)
          break
        default:
          break
      }
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature.')
      } else {
        errorNotification('Transaction failed.')
      }
    }
  }

  const stakeToken = async (token: string) => {
    try {
      const targetFarm = await getContract(
        library,
        account,
        getFarmContractAddress(token),
        contracts.contracts.WETHFarm.abi,
      )

      let tx

      if (
        wethLPToStake === '0.00' &&
        daiLPToStake === '0.00' &&
        usdcLPToStake === '0.00' &&
        wbtcLPToStake === '0.00'
      ) {
        errorNotification('Cannot stake zero tokens')
      } else {
        switch (token) {
          case 'weth':
            tx = await targetFarm.stake(
              ethers.utils.parseEther(wethLPToStake.toString()),
            )
            setWethLPToStake('0.00')
            break
          case 'dai':
            tx = await targetFarm.stake(
              ethers.utils.parseEther(daiLPToStake.toString()),
            )
            setDaiLPToStake('0.00')
            break
          case 'usdc':
            tx = await targetFarm.stake(
              ethers.utils.parseEther(usdcLPToStake.toString()),
            )
            setUsdcLPToStake('0.00')
            break
          case 'wbtc':
            tx = await targetFarm.stake(
              ethers.utils.parseEther(wbtcLPToStake.toString()),
            )
            setWbtcLPToStake('0.00')
            break
          default:
            break
        }
      }

      notifyUser(tx)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature.')
      } else {
        errorNotification('Transaction failed.')
      }
    }
  }

  const claimRewards = async (token: string) => {
    try {
      const targetFarm = await getContract(
        library,
        account,
        getFarmContractAddress(token),
        contracts.contracts.WETHFarm.abi,
      )

      let tx

      switch (token) {
        case 'weth':
          tx = await targetFarm.getReward()
          break
        case 'dai':
          tx = await targetFarm.getReward()
          break
        case 'usdc':
          tx = await targetFarm.getReward()
          break
        case 'wbtc':
          tx = await targetFarm.getReward()
          break
        default:
          break
      }

      notifyUser(tx)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature.')
      } else {
        errorNotification('Transaction failed.')
      }
    }
  }

  const exitFarm = async (token: string) => {
    try {
      const targetFarm = await getContract(
        library,
        account,
        getFarmContractAddress(token),
        contracts.contracts.WETHFarm.abi,
      )

      let tx

      switch (token) {
        case 'weth':
          tx = await targetFarm.exit()
          break
        case 'dai':
          tx = await targetFarm.exit()
          break
        case 'usdc':
          tx = await targetFarm.exit()
          break
        case 'wbtc':
          tx = await targetFarm.exit()
          break
        default:
          break
      }

      notifyUser(tx)
    } catch (error) {
      console.error(error)
      // @ts-ignore
      if (error.code === 4001) {
        errorNotification('User rejected transaction signature.')
      } else {
        errorNotification('Transaction failed.')
      }
    }
  }

  const onChangeStake = (e: any, token: string) => {
    switch (token) {
      case 'weth':
        setWethLPToStake(e.target.value)
        break
      case 'dai':
        setDaiLPToStake(e.target.value)
        break
      case 'usdc':
        setUsdcLPToStake(e.target.value)
        break
      case 'wbtc':
        setWbtcLPToStake(e.target.value)
        break
      default:
        break
    }
  }

  return (
    <div className={`${isDarkMode ? 'vaults vaults-dark-mode' : 'vaults'}`}>
      <Filler />
      <SwitchToRinkebyAlert
        currentChainId={currentChainId}
        requiredChainId={RINKEBY_CHAIN_ID}
        alertCondition={networkWarning}
        alertConditionHandler={() => setNetworkWarning(false)}
        isDarkMode={isDarkMode}
      />

      <h1 className="vaults-title bold text-center mb-3 mt-4 p-2">
        MoonFarm Vaults
      </h1>

      <p className="vaults-subtitle bold text-center mb-5 p-2">
        GM fren! Welcome to the MoonFarm! Feel free to pick your favorite farm &
        let your portfolio moon! 🚀
      </p>

      {isConnected ? (
        <div
          className={`${
            isDarkMode
              ? 'vaults-container vaults-container-dark-mode'
              : 'vaults-container'
          }`}
        >
          <div className="vault-container">
            <div className="vault-header">
              <span className="vault-title">
                <img
                  alt="MOON"
                  src={moon}
                  width={23}
                  height={23}
                  className="mr-2"
                />
                <img
                  alt="WETH"
                  src={weth}
                  width={23}
                  height={23}
                  className="mr-3"
                />
                MOON-WETH Farm
              </span>
              <span className="vault-property">
                In Wallet:{' '}
                <NumberFormat
                  value={parseFloat(wethBalance)}
                  decimalScale={2}
                />{' '}
                SLP
              </span>
              <span className="vault-property">
                Staked:{' '}
                <NumberFormat
                  value={parseFloat(wethBalanceStaked)}
                  decimalScale={2}
                />{' '}
                SLP
              </span>
              <span className="vault-property">
                APY: {`>`}
                <NumberFormat value={1000} decimalScale={2} />%
              </span>
            </div>
            <hr />
            <div className="vault-body">
              <form className="vault-form">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Amount"
                    value={wethLPToStake}
                    onChange={(e) => onChangeStake(e, 'weth')}
                  />

                  <div className="input-group-append">
                    {wethApproved ? (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => stakeToken('weth')}
                      >
                        Stake
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => approveToken('weth')}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </form>
              <div className="vault-buttons">
                <button
                  className="btn btn-primary bold mr-3"
                  onClick={() => claimRewards('weth')}
                >
                  Claim
                </button>
                <button
                  className="btn btn-primary bold"
                  onClick={() => exitFarm('weth')}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>

          <div className="vault-container">
            <div className="vault-header">
              <span className="vault-title">
                <img
                  alt="MOON"
                  src={moon}
                  width={23}
                  height={23}
                  className="mr-2"
                />
                <img
                  alt="DAI"
                  src={dai}
                  width={23}
                  height={23}
                  className="mr-3"
                />
                MOON-DAI Farm
              </span>
              <span className="vault-property">
                In Wallet:{' '}
                <NumberFormat value={parseFloat(daiBalance)} decimalScale={2} />{' '}
                SLP
              </span>
              <span className="vault-property">
                Staked:{' '}
                <NumberFormat
                  value={parseFloat(daiBalanceStaked)}
                  decimalScale={2}
                />{' '}
                SLP
              </span>
              <span className="vault-property">
                APY: {`>`}
                <NumberFormat value={1000} decimalScale={2} />%
              </span>
            </div>
            <hr />
            <div className="vault-body">
              <form className="vault-form">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Amount"
                    value={daiLPToStake}
                    onChange={(e) => onChangeStake(e, 'dai')}
                  />

                  <div className="input-group-append">
                    {daiApproved ? (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => stakeToken('dai')}
                      >
                        Stake
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => approveToken('dai')}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </form>
              <div className="vault-buttons">
                <button
                  className="btn btn-primary bold mr-3"
                  onClick={() => claimRewards('dai')}
                >
                  Claim
                </button>
                <button
                  className="btn btn-primary bold"
                  onClick={() => exitFarm('dai')}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>

          <div className="vault-container">
            <div className="vault-header">
              <span className="vault-title">
                <img
                  alt="MOON"
                  src={moon}
                  width={23}
                  height={23}
                  className="mr-2"
                />
                <img
                  alt="USDC"
                  src={usdc}
                  width={23}
                  height={23}
                  className="mr-3"
                  style={{
                    borderRadius: '100%',
                  }}
                />
                MOON-USDC Farm
              </span>
              <span className="vault-property">
                In Wallet:{' '}
                <NumberFormat
                  value={parseFloat(usdcBalance)}
                  decimalScale={2}
                />{' '}
                SLP
              </span>
              <span className="vault-property">
                Staked:{' '}
                <NumberFormat
                  value={parseFloat(usdcBalanceStaked)}
                  decimalScale={2}
                />{' '}
                SLP
              </span>
              <span className="vault-property">
                APY: {`>`}
                <NumberFormat value={1000} decimalScale={2} />%
              </span>
            </div>
            <hr />
            <div className="vault-body">
              <form className="vault-form">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Amount"
                    value={usdcLPToStake}
                    onChange={(e) => onChangeStake(e, 'usdc')}
                  />

                  <div className="input-group-append">
                    {usdcApproved ? (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => stakeToken('usdc')}
                      >
                        Stake
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => approveToken('usdc')}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </form>
              <div className="vault-buttons">
                <button
                  className="btn btn-primary bold mr-3"
                  onClick={() => claimRewards('usdc')}
                >
                  Claim
                </button>
                <button
                  className="btn btn-primary bold"
                  onClick={() => exitFarm('usdc')}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>

          <div className="vault-container">
            <div className="vault-header">
              <span className="vault-title">
                <img
                  alt="MOON"
                  src={moon}
                  width={23}
                  height={23}
                  className="mr-2"
                />
                <img
                  alt="WBTC"
                  src={wbtc}
                  width={23}
                  height={23}
                  className="mr-3"
                />
                MOON-WBTC Farm
              </span>
              <span className="vault-property">
                In Wallet:{' '}
                <NumberFormat
                  value={parseFloat(wbtcBalance)}
                  decimalScale={2}
                />{' '}
                SLP
              </span>
              <span className="vault-property">
                Staked:{' '}
                <NumberFormat
                  value={parseFloat(wbtcBalanceStaked)}
                  decimalScale={2}
                />{' '}
                SLP
              </span>
              <span className="vault-property">
                APY: {`>`}
                <NumberFormat value={1000} decimalScale={2} />%
              </span>
            </div>
            <hr />
            <div className="vault-body">
              <form className="vault-form">
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Amount"
                    value={wbtcLPToStake}
                    onChange={(e) => onChangeStake(e, 'wbtc')}
                  />

                  <div className="input-group-append">
                    {wbtcApproved ? (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => stakeToken('wbtc')}
                      >
                        Stake
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary bold"
                        onClick={() => approveToken('wbtc')}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </form>
              <div className="vault-buttons">
                <button
                  className="btn btn-primary bold mr-3"
                  onClick={() => claimRewards('wbtc')}
                >
                  Claim
                </button>
                <button
                  className="btn btn-primary bold"
                  onClick={() => exitFarm('wbtc')}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="vaults-subtitle bold text-center mb-5 p-2">
            ⚠️ Please connect your wallet to start earning rewards on Moonfarm
          </h2>
          <Filler />
          <Filler />
          <Filler />
        </>
      )}

      <Filler />
    </div>
  )
}

export default Vaults
