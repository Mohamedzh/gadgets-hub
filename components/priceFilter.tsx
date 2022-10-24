import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value}°C`;
}

export default function RangeSlider() {
  let min = 0
  let max = 200
  const [value, setValue] = React.useState<number[]>([min, max]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    console.log(newValue)
  };

  return (
    <Box sx={{ width: 300 }}>
      <p className='mb-8 text-xl font-semibold'>Filter by Price</p>
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
