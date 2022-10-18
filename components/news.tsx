import React from 'react'

type Props = {}

function News({ }: Props) {
    return (
        <div>
            <p className='text-4xl font-semibold m-3 text-white'>Latest news</p>
            <div className='grid grid-cols-2'>
                {Array.from(Array(4)).map((item, i) =>
                    <div key={i} className='m-3'>
                        <img src='https://m-cdn.phonearena.com/images/article/143165-wide-two_800/Apple-has-no-short-term-iPhone-Fold-launch-plans-iPad-Fold-instead-likely-coming-in-2024.webp?1666081471' />
                        <div className='text-white'>
                            Apple has no short-term iPhone Fold launch plans, iPad Fold instead likely coming in 2024
                            Adrian Diaconescu • 3m ago
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default News