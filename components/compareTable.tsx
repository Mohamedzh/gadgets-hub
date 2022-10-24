import { GetStaticProps } from 'next'
import React, { Fragment } from 'react'
import { prisma } from '../lib/db'
import { AddButton, classNames } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'
import { IoMdCloseCircle } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { removeFromComparison } from '../redux/slices/compareSlice'
import { AiOutlineMinusCircle } from 'react-icons/ai'
import Link from 'next/link'

type Props = {
    categories: DetailedCategory[]
    phones: DetailedPhone[]
}

function CompareTable({ categories, phones }: Props) {
    const dispatch = useDispatch()
    const comparePhones = useAppSelector(state => state.compare)
    // console.log(phones);
    console.log((phones[0].PhoneSpecs.filter(spec => spec.spec.categoryName === 'Network'))[1].value);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    {/* <h1 className="text-xl font-semibold text-gray-900">{currentPhone.name}</h1> */}
                    {/* <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                    </p> */}
                </div>

            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full">
                                <thead className="bg-white">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-gray-900 sm:pl-6 ">
                                            Phones

                                        </th>
                                        {phones.map((phone, i) =>
                                            <th scope="col" className="px-3 py-3.5 text-left font-semibold text-gray-900">
                                                {phone ?
                                                    <div className='flex flex-col place-items-center'>
                                                        <AiOutlineMinusCircle
                                                            onClick={() => dispatch(removeFromComparison(phone))}
                                                            className='w-8 h-8 self-end cursor-pointer hover:scale-125 ring-red-500 text-bold text-red-500 rounded-full'
                                                        />
                                                        <Link href={`/${phone.name.toLowerCase()}`}>
                                                            <a>
                                                                <img className='mb-3' src={phone.imgUrl} />
                                                                <p>{phone.description.slice(0, phone.description.indexOf('.'))}</p>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    : <AddButton />}
                                            </th>
                                        )}
                                        {/* <th scope="col" className="px-3 py-3.5 text-left  font-semibold text-gray-900">
                                            {phones[1] ?
                                                <div className='flex flex-col place-items-center'>
                                                    <IoMdCloseCircle
                                                        onClick={() => dispatch(removeFromComparison(phones[1]))}
                                                        className='w-10 h-10 self-end'
                                                    />
                                                    <img src={phones[1].imgUrl} />
                                                    {phones[1].name}
                                                </div>
                                                : <AddButton />}
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left  font-semibold text-gray-900">
                                            {phones[2] ?
                                                <div className='flex flex-col place-items-center'>
                                                    <IoMdCloseCircle
                                                        onClick={() => dispatch(removeFromComparison(phones[2]))}
                                                        className='w-10 h-10 self-end' />
                                                    <img src={phones[2].imgUrl} />
                                                    {phones[2].name}
                                                </div>
                                                : <AddButton />}
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {categories.map((category, idx) => (
                                        <Fragment
                                            key={idx}
                                        >
                                            <tr className="border-t border-gray-200">
                                                <th
                                                    colSpan={4}
                                                    scope="colgroup"
                                                    className="bg-gray-100 px-4 py-2 text-left text-lg font-semibold text-gray-900 sm:px-6"
                                                >
                                                    {category.name}
                                                </th>
                                            </tr>
                                            {category.specs.map((spec, i) => (
                                                <tr
                                                    key={i}
                                                    className={classNames(i === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                                                >
                                                    <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {spec.name}
                                                    </td>
                                                    {phones.map(phone =>
                                                        <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                                                            {(phone.PhoneSpecs.find(x => x.spec.alias === spec.alias))?.value || 'NA'}
                                                        </td>
                                                    )}
                                                    {/* <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                                                        {(phones[1].PhoneSpecs.find(x => x.spec.alias === spec.alias))?.value || 'NA'}
                                                    </td>
                                                    <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                                                        {(phones[2].PhoneSpecs.find(x => x.spec.alias === spec.alias))?.value || 'NA'}
                                                    </td> */}
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompareTable