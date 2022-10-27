import { Category } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AddButton, AddToComparison } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'
import Alert from './addPhoneAlert'
import SpecsTable from './phoneSpecsTable'


type Props = {
    currentPhone?: DetailedPhone
    categories: DetailedCategory[]
}

function PhoneDetails({ currentPhone, categories }: Props) {
    const dispatch = useDispatch()
    const comparedPhones = useAppSelector(state => state.compare)

    const [show, setShow] = useState<boolean>(false)

    useEffect(() => { console.log(comparedPhones) }, [comparedPhones])
    return (
        <div className='bg-white'>
            <div className='text-center'>
                <p className='text-5xl font-bold m-10 font-sans text-blue-900'>
                    {currentPhone?.description.slice(0, currentPhone?.description.indexOf('.'))}
                </p>

                <div className='grid grid-cols-4 m-5 place-items-center'>
                    <div>
                        <img className='col-span-1' src={currentPhone?.imgUrl} />
                        <p className='my-2 text-xl font-semibold'>{currentPhone?.name}</p>
                    </div>
                    <div className='col-span-2'>
                        <p className='text-3xl font-bold m-5 font-serif text-amber-800'>
                            Phone Summary
                        </p>
                        <div className=''>
                            {currentPhone?.PhoneQuickSpecs.map((spec, idx) =>
                                <div className='grid grid-cols-2 m-3 border-2 rounded divide-x-2 divide-slate-400 border-slate-400 border-x-2 border-t-2 '
                                    key={idx}>
                                    <p className='px-3 border-spacing-6 font-semibold text-blue-700'>{spec.quickspecName}</p>
                                    <p className='px-3'>{spec.value}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='col-span-1'>
                        <div>
                            {currentPhone && comparedPhones.length < 3 &&
                                <AddToComparison dispatch={dispatch} phone={currentPhone} setShow={setShow} />
                            }
                            {show && <Alert setShow={setShow} />}
                        </div>

                    </div>
                </div>
                {currentPhone &&
                    <SpecsTable currentPhone={currentPhone} categories={categories} />
                }
                {/* <p className='text-3xl font-bold m-5'>
                    Details
                </p>
                {currentPhone?.PhoneSpecs.map((detail, idx) =>
                    <div key={idx}>
                        <p>{detail.category}</p>
                        {detail.specs.map((spec, idx) =>
                        <div
                            className='grid grid-cols-2'
                        key={idx}
                        >
                            <p>{detail.specAlias}</p>
                            <p>{detail.value}</p>
                        </div>
                         )}
                    </div>
                )} */}
            </div>
        </div>
    )
}

export default PhoneDetails