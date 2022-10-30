import React from 'react'
import Link from 'next/link'
import { PhoneFilter } from '../types'

type Props = {
    currentPhones: PhoneFilter[]
}

function PhoneResultList({ currentPhones }: Props) {

    return (
        <div>
            {/* {currentPhones && */}
            <p className='m-3 text-white'>Results: {currentPhones.length} phones</p>
            <div className='grid grid-cols-4'>
                {currentPhones.length > 0 ? currentPhones.map((phone, i) =>
                    <Link href={`/${phone.name}`} key={i}>
                        <a
                            className='bg-white rounded-lg m-4 p-3 border border-solid flex flex-col place-items-center hover:scale-110 hover:opacity-75'
                        >
                            <img className='' src={phone.imgUrl} />
                            <p className='text-center text-xl font-semibold'>{phone.name}</p>
                        </a>
                    </Link>
                ) : <div className='font-semibold text-white text-2xl text-center col-span-4 mb-20'>No phones match your search criteria </div>}
            </div>

        </div>
    )
}

export default PhoneResultList