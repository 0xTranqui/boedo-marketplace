import { Header } from "../Header";
import { useContractRead, useAccount, useContractWrite } from "wagmi";
import { AsksV1_1Interface } from "@zoralabs/v3/dist/typechain/AsksV1_1"
import * as asksAddresses from "@zoralabs/v3/dist/addresses/1.json"
import { abi } from "@zoralabs/v3/dist/artifacts/AsksV1_1.sol/AsksV1_1.json"
import { useState, useEffect } from "react";
import { ReadContractResult } from "@wagmi/core";
import { BigNumber, ethers, utils } from "ethers";

export const FillAsk = (nft) => {

    interface fillAskCall {
        tokenContract: any,
        tokenId: any,
        fillCurrency: any,
        fillAmount: any,
        finder: any
    }

    const [fillAsk, setFillAsk] = useState<fillAskCall>({
        "tokenContract": nft.nft.nft.token.collectionAddress,
        "tokenId": nft.nft.nft.token.tokenId,
        "fillCurrency": "0x0000000000000000000000000000000000000000",
        "fillAmount": "",
        "finder": ""
    })

    const askTokenId = nft ? nft.nft.nft.token.tokenId : fillAsk.tokenId
    const askcollectionAddress = nft ? nft.nft.nft.token.collectionAddress : fillAsk.tokenContract


    // AsksV1_1 fillAsk Write
    const fillPrice = fillAsk.fillAmount ? ethers.utils.parseEther(fillAsk.fillAmount) : ""

    const { data: cancelData, isError: fillAskError, isLoading: fillAskLoading, isSuccess: fillAskSuccess, write: fillAskWrite  } = useContractWrite({
        addressOrName: asksAddresses.AsksV1_1,
        contractInterface: abi,
        functionName: 'fillAsk',
        args: [
            askcollectionAddress,
            askTokenId,
            fillAsk.fillCurrency,
            fillPrice,
            fillAsk.finder,

        ],
        overrides: {
            value: fillPrice
        },
        onError(error, variables, context) {
            console.log("error", error)
        },
        onSuccess(fillData, variables, context) {
            console.log("Success!", fillData)
        },
    })    

    const shortenedAddress = (address) => {
        let displayAddress = address?.substr(0,4) + "..." + address?.substr(-4)
        return displayAddress
    }

    return (
        <div className="flex flex-row flex-wrap w-fit space-y-1 text-white">
            <div className="flex flex-row flex-wrap w-full justify-center  border-solid ">
                <div>
                    {"Contract Address: " + shortenedAddress(nft.nft.nft.token.collectionAddress)}
                </div>                    
                <div className="ml-5 flex flex-row flex-wrap ">                    
                    {"Token Id: " + nft.nft.nft.token.tokenId}
                </div>                                       
            </div>               
            <div className="flex flex-row w-full">
                <input
                    className="flex flex-row flex-wrap w-full text-black text-center bg-slate-200 hover:bg-slate-300"
                    placeholder="Fill Currency"
                    name="fillAskCurrency"
                    type="text"
                    value={fillAsk.fillCurrency}
                    onChange={(e) => {
                        e.preventDefault();
                        setFillAsk(current => {
                            return {
                            ...current,
                            fillCurrency: e.target.value
                            }
                        })
                    }}
                    required                              
                >
                </input>
            </div>         

            <div className="flex flex-row w-full">
                <input
                    className="flex flex-row flex-wrap w-full text-black text-center bg-slate-200 hover:bg-slate-300"
                    placeholder="Fill Amount (ETH)"
                    name="fillAskAmount"
                    type="number"
                    value={fillAsk.fillAmount}
                    onChange={(e) => {
                        e.preventDefault();
                        setFillAsk(current => {
                            return {
                            ...current,
                            fillAmount: e.target.value
                            }
                        })
                    }}
                    required                              
                >
                </input>
            </div>

            <div className="flex flex-row w-full">
                <input
                    className="flex flex-row flex-wrap w-full text-black text-center bg-slate-200 hover:bg-slate-300"
                    placeholder="Finder"
                    name="fillAskFinder"
                    type="text"
                    value={fillAsk.finder}
                    onChange={(e) => {
                        e.preventDefault();
                        setFillAsk(current => {
                            return {
                            ...current,
                            finder: e.target.value
                            }
                        })
                    }}
                    required                              
                >
                </input>
            </div>                                                                                                  
            
            <button 
                type="button"
                onClick={() => fillAskWrite()}
                className="border-2 border-white border-solid w-full px-2 hover:bg-[#33FF57] hover:text-slate-900"
            >
                FILL ASK
            </button>

        </div>
    )
}