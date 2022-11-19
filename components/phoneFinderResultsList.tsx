import React from 'react'
import Link from 'next/link'
import { PhoneFilter } from '../types'

type Props = {
    currentPhones: PhoneFilter[]
    arLang: boolean
}

function PhoneResultList({ currentPhones, arLang }: Props) {

    return (
        <div>
            {/* {currentPhones && */}
            <p className='m-3 text-white'>{(arLang ? 'النتائج:' : 'Results:') + ' ' + currentPhones.length + ' ' + (arLang ? 'هاتف' : 'phones')}</p>
            <div className='grid grid-cols-2 lg:grid-cols-4'>
                {currentPhones.length > 0 ? currentPhones.map((phone, i) =>
                    <Link href={`/${arLang ? phone.name + '/ar' : phone.name}`} key={i}>
                        <a
                            className='bg-white rounded-lg m-2 lg:m-4 p-3 border border-solid flex flex-col place-items-center hover:scale-110 hover:opacity-75'
                        >
                            <img className='' src={phone.imgUrl} />
                            <p className='my-auto text-center lg:text-xl font-semibold'>{phone.name}</p>
                        </a>
                    </Link>
                ) : <div className='font-semibold text-white text-2xl text-center col-span-4 mb-20'>
                    {arLang ? 'لا يوجد هواتف تطابق نطاق بحثك' : 'No phones match your search criteria'}
                </div>
                }
            </div>

        </div>
    )
}

export default PhoneResultList