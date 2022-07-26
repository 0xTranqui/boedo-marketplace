import { Header } from "../Header";
import { useContractRead, useAccount, useContractWrite } from "wagmi";
import { AsksV1_1Interface } from "@zoralabs/v3/dist/typechain/AsksV1_1"
import * as asksAddresses from "@zoralabs/v3/dist/addresses/1.json"
import { abi } from "@zoralabs/v3/dist/artifacts/AsksV1_1.sol/AsksV1_1.json"
import { useState, useEffect } from "react";
import { ReadContractResult } from "@wagmi/core";
import { BigNumber, utils } from "ethers";

export const CancelAsk = (nft) => {

    interface cancelAskCall {
        tokenContract: any,
        tokenId: any
    }

    const [cancelAsk, setCancelAsk] = useState<cancelAskCall>({
        "tokenContract": nft.nft.nft.token.collectionAddress,
        "tokenId": nft.nft.nft.token.tokenId,
    })
    
    const askTokenId = nft ? nft.nft.nft.token.tokenId : cancelAsk.tokenId
    const askcollectionAddress = nft ? nft.nft.nft.token.collectionAddress : cancelAsk.tokenContract

    // AsksV1_1 cancelAsk Write
    const { data: cancelData, isError: cancelAskError, isLoading: cancelAskLoading, isSuccess: cancelAskSuccess, write: cancelAskWrite  } = useContractWrite({
        addressOrName: asksAddresses.AsksV1_1,
        contractInterface: abi,
        functionName: 'cancelAsk',
        args: [
            askcollectionAddress,
            askTokenId
        ],
        onError(error, variables, context) {
            console.log("error", error)
        },
        onSuccess(cancelData, variables, context) {
            console.log("Success!", cancelData)
        },
    })    

    const shortenedAddress = (address) => {
        let displayAddress = address?.substr(0,4) + "..." + address?.substr(-4)
        return displayAddress
    }
    
    return (
        <div className=" flex flex-row flex-wrap w-fit space-y-1 text-white">
            <div className="flex flex-row flex-wrap w-full justify-center">
                <div>
                    {"Contract Address: " + shortenedAddress(nft.nft.nft.token.collectionAddress)}
                </div>                    
                <div className="ml-5 flex flex-row flex-wrap ">                    
                    {"Token Id: " + nft.nft.nft.token.tokenId}
                </div>                                       
            </div>                                                                     
            <button 
                type="button"
                onClick={() => cancelAskWrite()}
                className="border-2 border-white border-solid flex flex-row justify-center w-full px-2 hover:text-slate-900 hover:bg-[#33FF57]"
            >
                CANCEL ASK
            </button>
        </div>
    )
}