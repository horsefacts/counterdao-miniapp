import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import { useAccount, useConnect, useReadContract, useWriteContract } from "wagmi";
import { CounterAbi } from "./contract/abi";
import { COUNTER_ADDRESS } from "./contract/constants";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">CounterDAO</h1>
        {isConnected ? <Counter /> : <ConnectWallet />}
      </div>
    </div>
  );
}

function Counter() {
  const {
    data: counterValue,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: CounterAbi,
    functionName: "see",
  });

  const { writeContractAsync, isPending, error: writeError } = useWriteContract();

  const handleHit = async () => {
    try {
      await writeContractAsync({
        address: COUNTER_ADDRESS,
        abi: CounterAbi,
        functionName: "hit",
      });
      refetch();
    } catch (e) {
      console.error("Error incrementing counter:", e);
    }
  };

  const handleDip = async () => {
    try {
      await writeContractAsync({
        address: COUNTER_ADDRESS,
        abi: CounterAbi,
        functionName: "dip",
      });
      refetch();
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
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg font-medium text-white
              bg-red-500 hover:bg-red-600 dark:hover:bg-red-400
              disabled:opacity-50 transition-colors"
          >
            {isPending ? "Processing..." : "Dip (-1)"}
          </button>
          <button
            type="button"
            onClick={handleHit}
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg font-medium text-white
              bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400
              disabled:opacity-50 transition-colors"
          >
            {isPending ? "Processing..." : "Hit (+1)"}
          </button>
        </div>
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
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Connect Your Wallet</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Connect your wallet to interact with the CounterDAO contract
      </p>
      <button
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
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
