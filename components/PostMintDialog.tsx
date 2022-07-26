import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import Link from 'next/link';

export default function PostMintDialog({ colorScheme, publicTxnLoadingStatus, publicTxnSuccessStatus, publicTxnHashLink}) {
    let [isOpen, setIsOpen] = useState(false)
    let [publicIsRendered, setPublicIsRendered] = useState("");
    let [holderIsRendered, setHolderIsRendered] = useState("");


    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const publicLocalTxnHash = publicTxnHashLink ? publicTxnHashLink.hash : ""

    // const shortenedHash = (hash) => {
    //    let displayHash = hash?.substr(0,4) + "..." + hash?.substr(-4)
    //    return displayHash
    // }

    useEffect(() => {
        setPublicIsRendered(publicTxnSuccessStatus)
        openModal();
        console.log("runnning use effect")
        },
        [publicTxnSuccessStatus]
    )

    return (
        <> 
        {publicTxnLoadingStatus == false && publicIsRendered == "success" ? (    
            <div> 
                <button
                    type="button"
                    onClick={openModal}
                    className={`border-[${colorScheme}] hover:bg-[${colorScheme}]
                    mt-10 w-full sm:text-lg relative flex flex-row p-2 pl-3 bg-black border-2 border-solid  hover:text-black`}
                >
                    YOUR MINT INFO
                </button>        
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                        <Dialog.Panel className="w-fit transform overflow-hidden bg-black align-middletransition-all shadow-[0_0px_30px_10px_rgba(0,0,0,1)]" >
                            <div className="border-white border-4 border-solid my-2 overflow-hidden rounded-none shadow-lg">
                                <div className="px-8 py-4">
                                    <div className="text-3xl mb-5">
                                    MINT SUCCESSFUL
                                    </div>
                                    <div className="text-2xl mb-5">
                                    <a 
                                        className={` hover:text-[${colorScheme}]`}
                                        style={{ textDecoration: "underline" }} href={"https://etherscan.io/tx/" + publicLocalTxnHash}
                                    >
                                        Transaction Link
                                    </a>
                                    </div>
                                    <div className="text-2xl mb-5">
                                    <Link href="/gallery">
                                        <a className={` hover:text-[${colorScheme}]`} style={{ textDecoration: "underline" }}>
                                            See Your Collection ➝ 
                                        </a>
                                    </Link>
                                    </div>
                                    <button                                    
                                        className={` hover:bg-[${colorScheme}] 
                                        px-4 py-2 text-xl text-white bg-black rounded-none borer-solid border-white border-4 hover:text-black`} 
                                        onClick={() => {
                                        closeModal()                          
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>                        
                        </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            </div>  
            ) : (
                <>
                </>
            )}
        </>         
    )
}