import React from 'react'
import styles from '../styles/Loading.module.css'

type Props = {}

function Loading({ }: Props) {
    return (
        <div className='flex place-items-center place-content-center min-h-[65vh]'>
            <div className={styles.lds}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div >
    )
}

export default Loading