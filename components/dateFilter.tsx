import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../lib/functions';


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
        <ThemeProvider theme={theme}>
            <Box sx={{ width: { xs: 100, sm: 150, md: 200, lg: 275 } }}>
                <p className='lg:mb-4 lg:mt-10 text-sm lg:text-xl font-semibold text-gray-200'>Filter by Year</p>
                <Slider
                    sx={{ color: 'blue' }}
                    getAriaLabel={() => 'Temperature range'}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    disableSwap
                    step={2}
                    min={min}
                    max={max}
                />
            </Box>
        </ThemeProvider>

    );
}
