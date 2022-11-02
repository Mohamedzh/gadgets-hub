import { Category, Phone } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {  AddToComparison } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'
import Alert from './addPhoneAlert'
import SpecsTable from './phoneSpecsTable'
import SeeAlsoSection from './seeAlsoSection'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/outline'
import { createBrowserSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@supabase/auth-helpers-react'
import FavsAlert from './addToFavsAlert'
import FavSuccessMsg from './addToFavsSuccess'
import axios from 'axios'

type Props = {
    currentPhone?: DetailedPhone
    categories: DetailedCategory[]
    otherPhones: Phone[]
}

function PhoneDetails({ currentPhone, categories, otherPhones }: Props) {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient())
    const user = useUser()

    const dispatch = useDispatch()
    const comparedPhones = useAppSelector(state => state.compare)

    const [show, setShow] = useState<boolean>(false)

    const [favMsg, setFavMsg] = useState<string>()
    const [favErrorMsg, setFavErrorMsg] = useState<string>()

    const [favColor, setFavColor] = useState<string>('white')


    const addToFavourites = async () => {
        try {
            if (user) {
                let data = { id: user.id, phone: currentPhone?.name }
                const res = await axios.post('/api/addToFavs', data)

                if (res.status === 200) {
                    setFavMsg('Phone added to your favorites')
                    setFavColor('yellow')
                }
            } else {
                setFavErrorMsg(`Please sign in first`)
            }
        } catch (error: any) {
            console.log(error);
            if (error.response.data.code === "P2002") {
                setFavMsg('Phone already exists in your favorites')
            }
        }

    }

    return (
        <div className='bg-gray-900'>
            <div className='text-center'>
                <p className='text-5xl font-bold m-10 font-sans text-blue-300'>
                    {currentPhone?.description.slice(0, currentPhone?.description.indexOf('.'))}
                </p>

                <div className='grid grid-cols-2 lg:grid-cols-4 m-5 place-items-center'>
                    <div className='lg:col-span-1 col-span-2 flex flex-col'>
                        <div className='flex'>
                            <img className='lg:w-60 lg:mt-5 mx-auto' src={currentPhone?.imgUrl} />
                        </div>
                        <p className='my-2 text-xl font-semibold text-white'>{currentPhone?.name}</p>
                        <div className='flex flex-col mt-3'>
                            <div className='flex' >
                                <button
                                    className='mr-3'
                                    onClick={() => addToFavourites()}
                                >
                                    <svg id='star' xmlns="http://www.w3.org/2000/svg" fill={favColor} viewBox="0 0 24 24" strokeWidth="0.5" stroke="currentColor" className="w-10 h-10 transition-colors">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                </button>
                                {/* <StarIcon className='w-10 h-10 mx-3 bg-white flex' /> */}
                                {currentPhone && !comparedPhones.includes(currentPhone) && comparedPhones.length < 4 &&
                                    <AddToComparison dispatch={dispatch} phone={currentPhone} setShow={setShow} />
                                }
                                {show && <Alert setShow={setShow} />}
                            </div>
                            {favErrorMsg &&
                                <FavsAlert msg={favErrorMsg} setFavErrorMsg={setFavErrorMsg} />}
                            {favMsg &&
                                <FavSuccessMsg msg={favMsg} setFavErrorMsg={setFavMsg} />}
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <p className='text-3xl font-bold m-5 font-serif text-amber-400'>
                            Phone Summary
                        </p>
                        <div className=''>
                            {currentPhone?.PhoneQuickSpecs.map((spec, idx) =>
                                <div className='grid grid-cols-2 m-3 border-2 rounded divide-x-2 divide-slate-400 border-slate-400 border-x-2 border-t-2 '
                                    key={idx}>
                                    <p className='px-3 my-auto border-spacing-6 font-semibold text-blue-400'>{spec.quickspecName}</p>
                                    <p className='px-3 text-gray-100'>{spec.value}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='lg:col-span-1 col-span-2'>

                        {otherPhones && <SeeAlsoSection otherPhones={otherPhones} />}


                    </div>
                </div>
                {currentPhone &&
                    <SpecsTable currentPhone={currentPhone} categories={categories} />
                }

            </div>
        </div>
    )
}

export default PhoneDetails