import { Phone, UserPhones } from '@prisma/client'
import { User } from '@supabase/auth-helpers-nextjs'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
    user: User
    arLang: boolean
}

function ProfileFavsSection({ user, arLang }: Props) {

    const [favPhones, setFavPhones] = useState<UserPhones & { phone: Phone }[]>()

    const getUserFavs = async (id: string) => {
        const res = await axios.post('/api/getFavourites', id)
        setFavPhones(res.data)
    }
    useEffect(() => {
        getUserFavs(user.id)
    }, [])

    return (
        <div>
            <p className='text-gray-100 text-2xl font-semibold mb-5'>{arLang ? 'الهواتف المفضلة' : 'Favourite Phones'}</p>
            {user &&
                <div className='grid grid-cols-2 lg:grid-cols-8'>
                    {favPhones?.map((item, i) =>
                        <Link href={`/${arLang ? item.phone.name + '/ar' : item.phone.name}`} key={i}>
                            <a
                                className='bg-white m-4 p-3 border border-solid flex flex-col place-items-center transition duration-500 ease-in-out hover:scale-110 hover:opacity-75'
                            >
                                <img className='' src={item.phone.imgUrl} />
                                <p className='text-center text-xl font-semibold'>{item.phone.name}</p>
                            </a>
                        </Link>
                    )}
                </div>
            }
        </div>
    )
}

export default ProfileFavsSection