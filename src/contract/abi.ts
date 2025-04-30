export const CounterAbi = [
  {
    inputs: [
      { internalType: "address", name: "_dss", type: "address" },
      { internalType: "address", name: "_ctr", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ctr",
    outputs: [{ internalType: "contract CTRLike", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dss",
    outputs: [{ internalType: "contract DSSLike", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "inc",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "net", type: "uint256" },
          { internalType: "uint256", name: "tab", type: "uint256" },
          { internalType: "uint256", name: "tax", type: "uint256" },
          { internalType: "uint256", name: "num", type: "uint256" },
          { internalType: "uint256", name: "hop", type: "uint256" },
        ],
        internalType: "struct Inc",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "see",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "val",
    outputs: [{ internalType: "contract DSSLike", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
