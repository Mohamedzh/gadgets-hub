import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../lib/functions';

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
    <ThemeProvider theme={theme}>
      <Box sx={{ width: { xs: 100, sm: 150, md: 200, lg: 275} }}>
        <p className='mb-4 text-xl font-semibold text-gray-200'>Filter by Price</p>
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
    </ThemeProvider>
  );
}
