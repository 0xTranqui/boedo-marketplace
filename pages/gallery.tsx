import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Header } from '../components/Header'

import NFTCard from "../components/NFTCard"
import Link from "next/link"
import { useContractRead, useAccount } from "wagmi"
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components"
import { Networks, NFTFetchConfiguration, Strategies, useNFT, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"
import editionsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import { BigNumber } from "ethers"
import { useState, useEffect } from 'react'
import { createClient } from "urql"
import { Switch } from "@headlessui/react"

// APIs
const API_MAINNET = "https://api.zora.co/graphql"
const API_RINKEBY = "https://indexer-dev-rinkeby.zora.co/v1/graphql"

const client = createClient({
  url: API_MAINNET,
})

console.log("client", client)

const Gallery: NextPage = () => {

  const [nftsMinted, setNFTsMinted] = useState();
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [userData, setUserData] = useState([])
  const [enabled, setEnabled] = useState(false);
  
  // hook to get the current account of user
  const { address, connector, isConnecting, isConnected, status} = useAccount(); 
  const currentUserAddress = address ? address.toLowerCase() : ""

  // read call to get current totalSupply
  const { data: totalSupplyData, isLoading, isSuccess, isFetching  } = useContractRead({
    addressOrName: "0x230864bab819a49a3e3cd634eb266f9042d22e82", // Sofja Collection
    contractInterface: editionsABI.abi,
    functionName: 'totalSupply',
    args: [],
    watch: true,
    onError(error) {
        console.log("error: ", error)
    },
    onSuccess(data) {
        console.log("success! --> ", totalSupplyData)
    }  
  })
  
  const totalSupply = totalSupplyData ? BigNumber.from(totalSupplyData).toString() : "loading"
  const totalSupplyNumber = Number(totalSupply)
  const numOfCallsRequired = Math.ceil(totalSupplyNumber / 100)

  const generateCalls = (numCalls) => {
      const callArray = [];

      for (let i = 0; i < numCalls; i++ ) {
      let call = 
    ` 
      query ListCollections {
        tokens(
          where: {collectionAddresses: "0x230864BaB819A49a3e3CD634EB266F9042d22e82"}
          pagination: {limit: 100}
        ) {
          nodes {
            marketsSummary {
              marketType
              tokenId
              properties {
                ... on V3Ask {
                  sellerFundsRecipient
                  findersFeeBps
                  askPrice {
                    nativePrice {
                      decimal
                      currency {
                        name
                      }
                    }
                  }
                  v3AskStatus
                }
              }
            }
            token {
              tokenId
              owner
              collectionAddress
            }
          }
        }
      }
    `

    callArray.push(call)
    } 
    return callArray
  }
  
  const generateQueries = (array, length) => {
    const promises = []
    for (let i = 0; i < length; i++) {
    promises.push(client.query(array[i]).toPromise())
    }
    return promises
  }
  
  const runPromises = async (inputArray) => {
    return Promise.all(inputArray).then((results) => {
      return [results]
    })
  }
  
  const concatPromiseResultsRinkeby = (multipleArrays) => {
    const masterArray = []
    for (let i = 0; i < multipleArrays[0].length; i++ ) {
      for (let j = 0; j < multipleArrays[0][i].data.Token.length; j++ ) {
          masterArray.push(multipleArrays[0][i].data.Token[j])
      }
    } return masterArray
  }

  const concatPromiseResultsMainnet = (multipleArrays) => {
    const masterArray = []
    for (let i = 0; i < multipleArrays[0].length; i++ ) {
      for (let j = 0; j < multipleArrays[0][i].data.tokens.nodes.length; j++ ) {
          masterArray.push(multipleArrays[0][i].data.tokens.nodes[j])
      }
    } return masterArray
  }

  const ownerFilter = (rawData) => {
    const filteredArray = []
      const filteredNFTs = rawData.filter((nft) => {
          if (nft.owner === currentUserAddress) {
            filteredArray.push(nft)
          }
          return filteredArray
      });
    setUserData(filteredArray)
  }

  const fetchData = async () => {
    console.log("fetching data")

    try {
      setLoading(true);

      const finalCallArray = generateCalls(numOfCallsRequired);
      console.log("Finalcallarray", finalCallArray)

      const finalPromises = generateQueries(finalCallArray, numOfCallsRequired);
      console.log("finalpromises", finalPromises)

      const promiseReturns = await runPromises(finalPromises);
      console.log("promiseReturns", promiseReturns)

      const promiseResults = concatPromiseResultsMainnet(promiseReturns)

      console.log("promiseResults: ", promiseResults);

      setRawData(promiseResults)

      ownerFilter(promiseResults)

      console.log("rawData", rawData)

    } catch(error) {
      console.error(error.message)
    }  finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
    },
    []
  )

  useEffect(() => {
    if(!!rawData)
    ownerFilter(rawData);
    },
    [currentUserAddress]
  )

  return (
    <div>
      <Header />
      <div className=" min-h-screen bg-black flex flex-row flex-wrap justify-center">
      <Switch.Group>
        <div className=" mt-20 mb-5 w-full flex flex-row justify-center items-center">
            <Switch.Label className="mr-4 font-bold text-white">FULL COLLECTION</Switch.Label>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${enabled ? `bg-[#4A524C]` : `bg-[#B8C5C9]`}
                  relative inline-flex h-[30px] w-[66px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
              <span className="sr-only">Use setting</span>
              <span
                  aria-hidden="true"
                  className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                    pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
            <Switch.Label className="ml-4 font-bold text-white">MY COLLECTION</Switch.Label>
        </div>
      </Switch.Group>
      {/* <div className="w-full flex flex-row justify-center text-[#202716] font-bold">
        <a 
            style={{ textDecoration: "none" }}
            href="https://zora.co/collections/0x7e6663E45Ae5689b313e6498D22B041f4283c88A"
        >
            <button className="text-center w-32 p-2 border-4 border-[#202716] bg-[#726e48] hover:bg-[#202716] hover:text-[#726e48] border-solid ">
              ZORA
            </button>   
        </a>
      </div> */}

      <div className="flex flex-row flex-wrap justify-center">
        {
            loading ? "loading . . . " : 
            <>
            { enabled === false ? ( 
            <NFTCard  nfts={rawData} />
            ) : (
            <NFTCard  nfts={userData} />
            )}
            </>               
        }
      </div>
    </div>
  </div>
  )
}

export default Gallery
