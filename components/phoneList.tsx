import { PhoneSummary } from '../pages/brands/[brand]'
import React from 'react'
import Link from 'next/link'


function PhoneList({ phones }: { phones: PhoneSummary[] }) {
    return (
        <div>
            <div className='grid grid-cols-4'>
                {phones.map((phone, i) =>
                    <Link href='/1/1/1' key={i}>
                        <a
                            key={i}
                            className='m-4 p-3 border border-solid flex flex-col place-items-center hover:scale-125 hover:opacity-75'
                        >
                            <img className='' src={phone.imgUrl} />
                            <p className='text-center text-xl font-semibold'>{phone.name}</p>
                        </a>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default PhoneList