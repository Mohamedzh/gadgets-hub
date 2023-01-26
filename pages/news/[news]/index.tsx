import { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

type Props = {
    data: any
}

function NewsDetails({ data }: Props) {
    // const parser = new DOMParser();
    // const dom  = parser.parseFromString(data.reviewHTML, "text/html")
    // console.log(dom);
    useEffect(()=>{
        let TempElement = document.createElement("div");
        TempElement.innerHTML = data.reviewHTML;
        document.getElementById('test')?.appendChild(TempElement);    
    })
    
    return (
        <div>
            <h1>News Details</h1>
            <div id='test'>
            </div>
        </div>
    )
}

export default NewsDetails
export const getServerSideProps: GetServerSideProps = async (context) => {
    const subject = 'https://www.gsmarena.com/' + context.params?.news + '.php'

    const getDetails = async (subject: string) => {
        const res = await axios.get('http:localhost:3000/api/getNewsDetails', { headers: { url: subject } })
        return res.data
    }
    const data = await getDetails(subject)
    return { props: { data } }
}