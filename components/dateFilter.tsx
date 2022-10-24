import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { PhoneSummary } from '../pages/brands/[brand]';

function valuetext(value: number) {
    return `${value}°C`;
}

export default function RangeSlider({ phones }: { phones: any[] }) {
    const years = phones.map(phone => { return phone.year })

    let min = Math.min(...years)
    let max = Math.max(...years)
    const [value, setValue] = React.useState<number[]>([min, max]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        console.log(newValue)
    };

    return (
        <Box sx={{ width: 300 }}>
            <p className='mb-8 text-xl font-semibold'>Filter by Year</p>
            <Slider
                sx={{ color: 'blue' }}
                getAriaLabel={() => 'Temperature range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="on"
                getAriaValueText={valuetext}
                disableSwap
                step={2}
                min={min}
                max={max}
            />
        </Box>
    );
}
