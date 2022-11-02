import React from 'react'
import ProfileSection from '../components/profileSection'
import { withPageAuth, User } from '@supabase/auth-helpers-nextjs'


type Props = {
    user: User
}

function Profile({ user }: Props) {
    return (
        <div className='lg:mx-10 mx-5'>
            <p>{user.email}</p>
            <ProfileSection user={user} />
        </div>
    )
}

export default Profile

export const getServerSideProps = withPageAuth({
    redirectTo: '/',
})