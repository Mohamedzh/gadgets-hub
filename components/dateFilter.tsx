import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
    return `${value}°C`;
}

export default function RangeSlider() {
    const [value, setValue] = React.useState<number[]>([20, 38]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        console.log(newValue)
    };

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                sx={{ color: 'blue' }}
                getAriaLabel={() => 'Temperature range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="on"
                getAriaValueText={valuetext}
                disableSwap
                step={2}
                min={1}
                max={200}
            />
        </Box>
    );
}
