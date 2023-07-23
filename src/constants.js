export const PRECISION = 1000000;
export const RE = /^[0-9]*[.]?[0-9]{0,6}$/;
export const blockchainUrl = "wss://aleph-zero-testnet-rpc.dwellir.com";
// Replace the below address with the address of the contract you deployed
export const CONTRACT_ADDRESS =
  "5GPQJvCUmhvxqP29pPqPzLQkw1tbnm9DEnKGdk3iAfuoFSSe";
// Replace the below abi with the abi of the contract you deployed
export const abi = {
  source: {
    hash: "0x9e8aac75cd2c5927a7e83e9ae3d3dc542ee12614658309e44ec41a0b7f26b5ee",
    language: "ink! 4.2.1",
    compiler: "rustc 1.70.0",
    build_info: {
      build_mode: "Release",
      cargo_contract_version: "3.0.1",
      rust_toolchain: "stable-x86_64-unknown-linux-gnu",
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: "Z",
      },
    },
  },
  contract: {
    name: "polkadot-amm",
    version: "0.1.0",
    authors: ["Nimish Agrawal realnimish@gmail.com"],
  },
  spec: {
    constructors: [
      {
        args: [
          {
            label: "fees",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          "Constructs a new AMM instance",
          "@param fees: valid interval -> [0,1000)",
        ],
        label: "new",
        payable: false,
        returnType: {
          displayName: ["ink_primitives", "ConstructorResult"],
          type: 1,
        },
        selector: "0x9bae9d5e",
      },
    ],
    docs: [],
    environment: {
      accountId: {
        displayName: ["AccountId"],
        type: 14,
      },
      balance: {
        displayName: ["Balance"],
        type: 0,
      },
      blockNumber: {
        displayName: ["BlockNumber"],
        type: 19,
      },
      chainExtension: {
        displayName: ["ChainExtension"],
        type: 20,
      },
      hash: {
        displayName: ["Hash"],
        type: 17,
      },
      maxEventTopics: 4,
      timestamp: {
        displayName: ["Timestamp"],
        type: 18,
      },
    },
    events: [],
    lang_error: {
      displayName: ["ink", "LangError"],
      type: 3,
    },
    messages: [
      {
        args: [
          {
            label: "amount_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
          {
            label: "amount_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [" Sends free token(s) to the invoker"],
        label: "faucet",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 1,
        },
        selector: "0x91bd0a53",
      },
      {
        args: [],
        default: false,
        docs: [" Returns the balance of the user"],
        label: "get_my_holdings",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 4,
        },
        selector: "0xc95a653e",
      },
      {
        args: [],
        default: false,
        docs: [
          " Returns the amount of tokens locked in the pool,total shares issued & trading fee param",
        ],
        label: "get_pool_details",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 6,
        },
        selector: "0x819c76c4",
      },
      {
        args: [
          {
            label: "amount_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Returns amount of Token1 required when providing liquidity with amount_token2 quantity of Token2",
        ],
        label: "get_equivalent_token1_estimate",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0x24ccf381",
      },
      {
        args: [
          {
            label: "amount_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Returns amount of Token2 required when providing liquidity with amount_token1 quantity of Token1",
        ],
        label: "get_equivalent_token2_estimate",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0xab9b6564",
      },
      {
        args: [
          {
            label: "amount_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
          {
            label: "amount_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Adding new liquidity in the pool",
          " Returns the amount of share issued for locking given assets",
        ],
        label: "provide",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0x3f1420fd",
      },
      {
        args: [
          {
            label: "share",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Returns the estimate of Token1 & Token2 that will be released on burning given share",
        ],
        label: "get_withdraw_estimate",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 11,
        },
        selector: "0xb457d6c8",
      },
      {
        args: [
          {
            label: "share",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Removes liquidity from the pool and releases corresponding Token1 & Token2 to the withdrawer",
        ],
        label: "withdraw",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 11,
        },
        selector: "0x410fcc9d",
      },
      {
        args: [
          {
            label: "amount_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Returns the amount of Token2 that the user will get when swapping a given amount of Token1 for Token2",
        ],
        label: "get_swap_token1_estimate_given_token1",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0xe854d7d1",
      },
      {
        args: [
          {
            label: "amount_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Returns the amount of Token1 that the user should swap to get amount_token2 in return",
        ],
        label: "get_swap_token1_estimate_given_token2",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0xf04419b4",
      },
      {
        args: [
          {
            label: "amount_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
          {
            label: "min_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Swaps given amount of Token1 to Token2 using algorithmic price determination",
          " Swap fails if Token2 amount is less than min_token2",
        ],
        label: "swap_token1_given_token1",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0x48395d65",
      },
      {
        args: [
          {
            label: "amount_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
          {
            label: "max_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Swaps given amount of Token1 to Token2 using algorithmic price determination",
          " Swap fails if amount of Token1 required to obtain amount_token2 exceeds max_token1",
        ],
        label: "swap_token1_given_token2",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0xa771453b",
      },
      {
        args: [
          {
            label: "amount_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Returns the amount of Token2 that the user will get when swapping a given amount of Token1 for Token2",
        ],
        label: "get_swap_token2_estimate_given_token2",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0xec7e1a49",
      },
      {
        args: [
          {
            label: "amount_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Returns the amount of Token2 that the user should swap to get amount_token1 in return",
        ],
        label: "get_swap_token2_estimate_given_token1",
        mutates: false,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0xece7a514",
      },
      {
        args: [
          {
            label: "amount_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
          {
            label: "min_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Swaps given amount of Token2 to Token1 using algorithmic price determination",
          " Swap fails if Token1 amount is less than min_token1",
        ],
        label: "swap_token2_given_token2",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0x7c8177ae",
      },
      {
        args: [
          {
            label: "amount_token1",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
          {
            label: "max_token2",
            type: {
              displayName: ["Balance"],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [
          " Swaps given amount of Token2 to Token1 using algorithmic price determination",
          " Swap fails if amount of Token2 required to obtain amount_token1 exceeds max_token2",
        ],
        label: "swap_token2_given_token1",
        mutates: true,
        payable: false,
        returnType: {
          displayName: ["ink", "MessageResult"],
          type: 8,
        },
        selector: "0xf8be2254",
      },
    ],
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "total_shares",
            },
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "total_token1",
            },
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "total_token2",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x08d0773c",
                      ty: 0,
                    },
                  },
                  root_key: "0x08d0773c",
                },
              },
              name: "shares",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0xe717d004",
                      ty: 0,
                    },
                  },
                  root_key: "0xe717d004",
                },
              },
              name: "token1_balance",
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: "0x0402f4cb",
                      ty: 0,
                    },
                  },
                  root_key: "0x0402f4cb",
                },
              },
              name: "token2_balance",
            },
            {
              layout: {
                leaf: {
                  key: "0x00000000",
                  ty: 0,
                },
              },
              name: "fees",
            },
          ],
          name: "Amm",
        },
      },
      root_key: "0x00000000",
    },
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          primitive: "u128",
        },
      },
    },
    {
      id: 1,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 2,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 2,
          },
          {
            name: "E",
            type: 3,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 2,
      type: {
        def: {
          tuple: [],
        },
      },
    },
    {
      id: 3,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 1,
                name: "CouldNotReadInput",
              },
            ],
          },
        },
        path: ["ink_primitives", "LangError"],
      },
    },
    {
      id: 4,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 5,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 5,
          },
          {
            name: "E",
            type: 3,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 5,
      type: {
        def: {
          tuple: [0, 0, 0],
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 7,
          },
          {
            name: "E",
            type: 3,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 7,
      type: {
        def: {
          tuple: [0, 0, 0, 0],
        },
      },
    },
    {
      id: 8,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 9,
          },
          {
            name: "E",
            type: 3,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 9,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 0,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 10,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 0,
          },
          {
            name: "E",
            type: 10,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 10,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: "ZeroLiquidity",
              },
              {
                index: 1,
                name: "ZeroAmount",
              },
              {
                index: 2,
                name: "InsufficientAmount",
              },
              {
                index: 3,
                name: "NonEquivalentValue",
              },
              {
                index: 4,
                name: "ThresholdNotReached",
              },
              {
                index: 5,
                name: "InvalidShare",
              },
              {
                index: 6,
                name: "InsufficientLiquidity",
              },
              {
                index: 7,
                name: "SlippageExceeded",
              },
            ],
          },
        },
        path: ["polkadot_amm", "amm", "Error"],
      },
    },
    {
      id: 11,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 12,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 3,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 12,
          },
          {
            name: "E",
            type: 3,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 12,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 0,
                name: "Ok",
              },
              {
                fields: [
                  {
                    type: 10,
                  },
                ],
                index: 1,
                name: "Err",
              },
            ],
          },
        },
        params: [
          {
            name: "T",
            type: 13,
          },
          {
            name: "E",
            type: 10,
          },
        ],
        path: ["Result"],
      },
    },
    {
      id: 13,
      type: {
        def: {
          tuple: [0, 0],
        },
      },
    },
    {
      id: 14,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 15,
                typeName: "[u8; 32]",
              },
            ],
          },
        },
        path: ["ink_primitives", "types", "AccountId"],
      },
    },
    {
      id: 15,
      type: {
        def: {
          array: {
            len: 32,
            type: 16,
          },
        },
      },
    },
    {
      id: 16,
      type: {
        def: {
          primitive: "u8",
        },
      },
    },
    {
      id: 17,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 15,
                typeName: "[u8; 32]",
              },
            ],
          },
        },
        path: ["ink_primitives", "types", "Hash"],
      },
    },
    {
      id: 18,
      type: {
        def: {
          primitive: "u64",
        },
      },
    },
    {
      id: 19,
      type: {
        def: {
          primitive: "u32",
        },
      },
    },
    {
      id: 20,
      type: {
        def: {
          variant: {},
        },
        path: ["ink_env", "types", "NoChainExtension"],
      },
    },
  ],
  version: "4",
};
