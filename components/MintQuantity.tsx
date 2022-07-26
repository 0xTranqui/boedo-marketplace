import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useAppContext } from "../context/useAppContext"

const sortOptions = [
   { name: 'QUANTITY', queryValue: '0' },
   { name: '1', queryValue: '1' },
   { name: '2', queryValue: '2' },
   { name: '3', queryValue: '3' },
   { name: '4', queryValue: '4' },
   { name: '5', queryValue: '5' }
]

export default function MintQuantity({ colorScheme }) {
   const { mintQuantity, setMintQuantity } = useAppContext()
   console.log()
   
   const select = (arg) => {
      setMintQuantity(arg);
      console.log("logging quantity arg: ", arg)
   }
   
   return (
      <div className={`text-[${colorScheme}] z-10 flex flex-row justify-self-end`}>
         <Listbox value={mintQuantity} onChange={select}>
            <div className="relative">

               { colorScheme === "#c23d05" ? (
               <Listbox.Button className={`border-[${colorScheme}] hover:bg-[${colorScheme}] focus-visible:ring-offset-[${colorScheme}]
               w-fit h-full hover:text-black cursor-pointer relative border-solid  border-2 bg-transparent py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-xl`}
               >
               
               
               <span className="block truncate">{mintQuantity.name}</span>
               <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                     className="h-5 w-5"
                     aria-hidden="true" 
                  />
               </span>
               </Listbox.Button>
               ) : (
               <Listbox.Button className={`border-[${colorScheme}] hover:bg-[${colorScheme}] focus-visible:ring-offset-[${colorScheme}]
               w-fit h-full hover:text-white cursor-pointer relative border-solid  border-2 bg-transparent py- pl-3 pr-10 text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-xl`}
               >
               
               
               <span className="block truncate">{mintQuantity.name}</span>
               <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                     className="h-5 w-5"
                     aria-hidden="true" 
                  />
               </span>
               </Listbox.Button>
               )}
               <Transition
               as={Fragment}
               leave="transition ease-in duration-100"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
               >

                  { colorScheme === "#c23d05" ? (
                  <Listbox.Options className="absolute z-[11] mt-1 max-h-60 w-full  overflow-auto  bg-black text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                     {sortOptions.map((option, optionIdx) => (
                        <Listbox.Option
                        key={optionIdx}
                        className={({ active }) =>
                           `cursor-pointer border-2 border-solid border-[${colorScheme}] relative select-none py-2 pl-4 pr-4 ${
                              active ? `bg-[#c23d05] text-black ` : `text-[${colorScheme}] bg-black `
                           }`
                        }
                        value={option}
                        >
                        {({ selected }) => (
                           <>
                              <span
                              className={`block truncate ${
                                 selected ? 'font-medium' : 'font-normal'
                              }`}
                              >
                              {option.name}
                              </span>
                              {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                 <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                              ) : null}
                           </>
                        )}
                        </Listbox.Option>
                     ))}
                  </Listbox.Options>
                  ) : (
                  <Listbox.Options className="absolute z-[11] mt-1 max-h-60 w-full  overflow-auto  bg-white text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                     {sortOptions.map((option, optionIdx) => (
                        <Listbox.Option
                        key={optionIdx}
                        className={({ active }) =>
                           `cursor-pointer border-2 border-solid border-[${colorScheme}] relative select-none py-2 pl-4 pr-4 ${
                              active ? `bg-[#40bedc]  text-white ` : `text-[${colorScheme}] bg-white `
                           }`
                        }
                        value={option}
                        >
                        {({ selected }) => (
                           <>
                              <span
                              className={`block truncate ${
                                 selected ? 'font-medium' : 'font-normal'
                              }`}
                              >
                              {option.name}
                              </span>
                              {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                 <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                              ) : null}
                           </>
                        )}
                        </Listbox.Option>
                     ))}
                  </Listbox.Options>
                  )}
               </Transition>
            </div>
         </Listbox>
      </div>
   )
}