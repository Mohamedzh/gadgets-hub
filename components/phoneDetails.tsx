import { Category } from '@prisma/client'
import React from 'react'
import { DetailedCategory, DetailedPhone } from '../types'
import SpecsTable from './phoneSpecsTable'


type Props = {
    currentPhone?: DetailedPhone
    categories:DetailedCategory[]
}

function PhoneDetails({ currentPhone, categories }: Props) {
    return (
        <div className='bg-white'>
            <div className='text-center'>
                <p className='text-3xl font-bold m-5'>
                    {currentPhone?.name}
                </p>
                {currentPhone &&
                    <SpecsTable currentPhone={currentPhone} categories={categories} />
                }
                <div className='grid grid-cols-3 m-5 place-items-center'>
                    <img className='col-span-1' src={currentPhone?.imgUrl} />
                    <div className='col-span-2'>
                        <p className='text-3xl font-bold m-5'>
                            Quick Specs
                        </p>
                        {currentPhone?.PhoneQuickSpecs.map((spec, idx) =>
                            <div className='grid grid-cols-2' key={idx}>
                                <p>{spec.quickspecName}</p>
                                <p>{spec.value}</p>
                            </div>
                        )}
                    </div>
                </div>
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