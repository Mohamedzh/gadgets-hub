import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../lib/functions';
import { Dispatch, SetStateAction } from 'react';
import { EURPrice, Phone } from '@prisma/client';
import { PhoneWithPrice } from '../types';
import { useRouter } from 'next/router';


function valuetext(value: number) {
    return `Year ${value}`;
}

type Props = {
    phones: PhoneWithPrice[]
    sortedPhones: PhoneWithPrice[]
    setSortedPhones: Dispatch<SetStateAction<PhoneWithPrice[]>>
}

export default function RangeSlider({ phones, setSortedPhones, sortedPhones }: Props) {
    const router = useRouter()
    const years = phones.map(phone => { return phone.year })

    let min = Math.min(...years)
    let max = Math.max(...years)
    const [value, setValue] = React.useState<number[]>([min, max]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        setYearFilter(newValue as number[])
    };

    const setYearFilter = (newValue: number[]) => {
        setSortedPhones(phones.filter(phone => phone.year >= newValue[0] && phone.year <= newValue[1]))
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: { xs: 100, sm: 150, md: 200, lg: 275 } }}>
                <p className='lg:mb-4 lg:mt-10 text-sm lg:text-xl font-semibold text-gray-200'>{router.asPath.includes('/ar') ? 'تصنيف بواسطة سنة الاصدار' : 'Filter by Year'}</p>
                <Slider
                    sx={{ color: 'blue' }}
                    getAriaLabel={() => 'Year range'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    disableSwap
                    step={1}
                    min={min}
                    max={max}
                />
            </Box>
        </ThemeProvider>

    );
}
