import { Category, Phone } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AddButton, AddToComparison } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'
import Alert from './addPhoneAlert'
import SpecsTable from './phoneSpecsTable'
import SeeAlsoSection from './seeAlsoSection'


type Props = {
    currentPhone?: DetailedPhone
    categories: DetailedCategory[]
    otherPhones: Phone[]
}

function PhoneDetails({ currentPhone, categories, otherPhones }: Props) {
    const dispatch = useDispatch()
    const comparedPhones = useAppSelector(state => state.compare)

    const [show, setShow] = useState<boolean>(false)

    useEffect(() => { console.log(comparedPhones) }, [comparedPhones])
    return (
        <div className='bg-gray-900'>
            <div className='text-center'>
                <p className='text-5xl font-bold m-10 font-sans text-blue-300'>
                    {currentPhone?.description.slice(0, currentPhone?.description.indexOf('.'))}
                </p>

                <div className='grid grid-cols-2 lg:grid-cols-4 m-5 place-items-center'>
                    <div className='lg:col-span-1 col-span-2 flex flex-col'>
                        <img className='lg:w-60 lg:mt-5 mx-auto' src={currentPhone?.imgUrl} />
                        <p className='my-2 text-xl font-semibold text-white'>{currentPhone?.name}</p>
                        <div className=''>
                            {currentPhone && !comparedPhones.includes(currentPhone) &&
                                <AddToComparison dispatch={dispatch} phone={currentPhone} setShow={setShow} />
                            }
                            {show && <Alert setShow={setShow} />}
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