import React from 'react'
import { DetailedCategory, DetailedPhone } from '../../types'

type Props = {
    categories: DetailedCategory[]
    phones: DetailedPhone[]
}

function CompareTable2({ categories, phones }: Props) {
    return (
        <div className='grid grid-cols-4 text-white m-5 text-center'>
            <div>
                <p className='border-b-2'>Phone Specs</p>
                {categories.map((category, i) =>
                    <div key={i}>
                        <p>{category.name}</p>
                        {category.specs.map((spec, j) =>
                            <div key={j}>
                                <p>{spec.name}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div>
            <p className='border-b-2'>Phone 1</p>
            {phones[0].PhoneSpecs.map((phoneSpec, l)=>
            <div key={l}>
                <p>{phoneSpec.value}</p>
            </div>
                )}
            </div>
        </div>
    )
}

export default CompareTable2