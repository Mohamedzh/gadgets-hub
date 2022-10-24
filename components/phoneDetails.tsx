import { Category } from '@prisma/client'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AddButton, AddToComparison } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'
import SpecsTable from './phoneSpecsTable'


type Props = {
    currentPhone?: DetailedPhone
    categories: DetailedCategory[]
}

function PhoneDetails({ currentPhone, categories }: Props) {
    const dispatch = useDispatch()
    const comparedPhones = useAppSelector(state => state.compare)
    useEffect(() => { console.log(comparedPhones) }, [comparedPhones])
    return (
        <div className='bg-white'>
            <div className='text-center'>
                <p className='text-6xl font-bold m-10'>
                    {currentPhone?.name}
                </p>

                <div className='grid grid-cols-4 m-5 place-items-center'>
                    <img className='col-span-1' src={currentPhone?.imgUrl} />
                    <div className='col-span-2'>
                        <p className='text-3xl font-bold m-5'>
                            Quick Specifications
                        </p>
                        <div className='border-b-2'>
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
                        {currentPhone && comparedPhones.length < 3 &&
                            <AddToComparison dispatch={dispatch} phone={currentPhone} />
                        }
                    </div>
                </div>
                {currentPhone &&
                    <SpecsTable currentPhone={currentPhone} categories={categories} />
                }
                <p className='text-3xl font-bold m-5'>
                    Details
                </p>
                {currentPhone?.PhoneSpecs.map((detail, idx) =>
                    <div key={idx}>
                        {/* <p>{detail.category}</p> */}
                        {/* {detail.specs.map((spec, idx) => */}
                        <div
                            className='grid grid-cols-2'
                        // key={idx}
                        >
                            <p>{detail.specAlias}</p>
                            <p>{detail.value}</p>
                        </div>
                        {/*  )} */}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PhoneDetails