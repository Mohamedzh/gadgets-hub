import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import axios from 'axios'

type Props = {
    openSignUp: boolean
    setOpenSignUp: Dispatch<SetStateAction<boolean>>
    setOpenLogin: Dispatch<SetStateAction<boolean>>
}

export default function SignUp({ setOpenSignUp, openSignUp, setOpenLogin }: Props) {

    const [supabaseClient] = useState(() => createBrowserSupabaseClient())


    const formData = [{ name: 'name', type: 'text', label: 'Name' },
    { name: 'nickName', type: 'text', label: 'Nickname' },
    { name: 'email', type: 'email', label: 'Email Address' },
    { name: 'password', type: 'password', label: 'Password' }]

    const formik = useFormik({
        initialValues: {
            name: '',
            nickName: '',
            email: '',
            password: ''
        },
        onSubmit: async (values) => {
            console.log(values);
            const newUser = await supabaseClient.auth.signUp({ email: values.email, password: values.password, options: { data: { nickName: values.nickName } } })
            const { data, error } = newUser
            console.log(data);
            if (data.user) {
                const { id } = data.user
                const userData = { ...values, id }
                await axios.post(`/api/signup`, userData)
            }
        },
        validationSchema: Yup.object({

        })
    })
    return (
        <>

            <Transition.Root show={openSignUp} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpenSignUp}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8  sm:p-6">
                                    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                            <img
                                                className="mx-auto h-12 w-auto"
                                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                                alt="Your Company"
                                            />
                                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign up to your account</h2>
                                        </div>

                                        <div className="mt-8 sm:mx-auto sm:w-full">
                                            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                                                    <div className='grid grid-cols-2'>
                                                        {formData.map((data, i) =>
                                                            <div key={i} className={`${i === 0 || i === 2 ? 'mr-2' : 'ml-2'}`}>
                                                                <label htmlFor={data.name} className="block text-sm font-medium text-gray-700">
                                                                    {data.label}
                                                                </label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        id={data.name}
                                                                        name={data.name}
                                                                        type={data.type}
                                                                        autoComplete={data.name}
                                                                        onBlur={formik.handleBlur}
                                                                        onChange={formik.handleChange}
                                                                        required
                                                                        className="block appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div> */}

                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            Sign up
                                                        </button>
                                                        <p>
                                                            Already have an account?<button
                                                                onClick={() => { setOpenSignUp(false); setOpenLogin(true) }}
                                                                className='underline'> Login</button>
                                                        </p>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
            {/** */}

        </>
    )
}
