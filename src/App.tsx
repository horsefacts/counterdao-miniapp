import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useReadContract,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { mainnet } from "viem/chains";

import DSSDiagram from "./img/dss-diagram.png";
import { CounterAbi } from "./contract/abi";
import { COUNTER_ADDRESS } from "./contract/constants";

function App() {
  const { isConnected } = useAccount();

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full mb-8">
        <img
          src={DSSDiagram}
          alt="Decentralized Summation System Diagram"
          className="w-full rounded-lg shadow-md"
        />
      </div>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          CounterDAO
        </h1>
        {isConnected ? <Counter /> : <ConnectWallet />}
      </div>
    </div>
  );
}

function Counter() {
  const { switchChainAsync } = useSwitchChain();
  const {
    data: counterValue,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: CounterAbi,
    functionName: "see",
    chainId: mainnet.id,
  });

  const {
    writeContractAsync,
    isPending,
    error: writeError,
  } = useWriteContract();

  const [transactionHash, setTransactionHash] = useState<
    `0x${string}` | undefined
  >();

  const { data: receipt, isLoading: isConfirming } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

  useEffect(() => {
    if (receipt) {
      refetch();
    }
  }, [receipt, refetch]);

  const handleHit = async () => {
    try {
      await switchChainAsync({ chainId: mainnet.id });
      const hash = await writeContractAsync({
        address: COUNTER_ADDRESS,
        abi: CounterAbi,
        functionName: "hit",
        chainId: mainnet.id,
      });
      setTransactionHash(hash);
    } catch (e) {
      console.error("Error incrementing counter:", e);
    }
  };

  const handleDip = async () => {
    try {
      await switchChainAsync({ chainId: mainnet.id });
      const hash = await writeContractAsync({
        address: COUNTER_ADDRESS,
        abi: CounterAbi,
        functionName: "dip",
        chainId: mainnet.id,
      });
      setTransactionHash(hash);
    } catch (e) {
      console.error("Error decrementing counter:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-6" />
        <div className="flex justify-center gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
      <div className="text-center">
        <div className="text-7xl font-bold mb-8 text-gray-900 dark:text-white transition-colors">
          {counterValue?.toString()}
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleDip}
            disabled={isPending || isConfirming}
            className="px-6 py-2.5 rounded-lg font-medium text-white
              bg-red-500 hover:bg-red-600 dark:hover:bg-red-400
              disabled:opacity-50 transition-colors"
          >
            {isPending ? "Processing..." : "Dip"}
          </button>
          <button
            type="button"
            onClick={handleHit}
            disabled={isPending || isConfirming}
            className="px-6 py-2.5 rounded-lg font-medium text-white
              bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400
              disabled:opacity-50 transition-colors"
          >
            {isPending ? "Processing..." : "Hit"}
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            sdk.actions.openUrl("https://github.com/counterdao/dss")
          }
          className="mt-6 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm font-medium transition-colors"
        >
          Learn more about the Decentralized Summation System
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          Error: {error.message}
        </div>
      )}

      {writeError && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          Transaction Error: {writeError.message}
        </div>
      )}
    </div>
  );
}

function ConnectWallet() {
  const { connect, connectors } = useConnect();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center transition-colors">
      <button
        type="button"
        onClick={() =>
          connect({ connector: connectors[0], chainId: mainnet.id })
        }
        className="px-6 py-2.5 rounded-lg font-medium text-white
          bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400
          transition-colors"
      >
        Connect Wallet
      </button>
    </div>
  );
}

export default App;
