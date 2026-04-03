'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface WalletContextType {
  address: string | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  chainId: number | null
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)

  const connect = useCallback(async () => {
    setIsConnecting(true)
    try {
      // Check for MetaMask / injected provider
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum

        const accounts: string[] = await ethereum.request({
          method: 'eth_requestAccounts',
        })

        if (accounts.length > 0) {
          setAddress(accounts[0])

          const chain = await ethereum.request({ method: 'eth_chainId' })
          setChainId(parseInt(chain, 16))

          // Listen for account changes
          ethereum.on('accountsChanged', (newAccounts: string[]) => {
            if (newAccounts.length === 0) {
              setAddress(null)
            } else {
              setAddress(newAccounts[0])
            }
          })

          ethereum.on('chainChanged', (newChain: string) => {
            setChainId(parseInt(newChain, 16))
          })
        }
      } else {
        // No injected wallet — open MetaMask install page
        window.open('https://metamask.io/download/', '_blank')
      }
    } catch (err) {
      console.error('Wallet connection failed:', err)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setChainId(null)
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        isConnected: !!address,
        connect,
        disconnect,
        chainId,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)