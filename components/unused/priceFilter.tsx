import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../lib/functions";
import { EURPrice, Phone } from "@prisma/client";
import { PhoneWithPrice } from "../../types";

function valuetext(value: number) {
  return `EUR ${value}`;
}

// type Props = {
//   phones: PhoneWithPrice[]
//   sortedPhones: PhoneWithPrice[]
//   setSortedPhones: React.Dispatch<React.SetStateAction<PhoneWithPrice[]>>
// }

export default function RangeSlider() {
// { phones, setSortedPhones, sortedPhones }: Props
  // const prices = phones.map(phone => { return phone.EURPrice.value })

  // let min = Math.min(...prices)
  // let max = Math.max(...prices)
  // const [value, setValue] = React.useState<number[]>([min, max]);

  // const handleChange = (event: Event, newValue: number | number[]) => {
  //   setValue(newValue as number[]);
  //   setPriceFilter(newValue as number[])
  // };

  // const setPriceFilter = (newValue: number[]) => {
  //   setSortedPhones(phones.filter(phone => phone.EURPrice.value >= newValue[0] && phone.EURPrice.value <= newValue[1]))
  //   console.log(phones.filter(phone => phone.EURPrice.value >= newValue[0] && phone.EURPrice.value <= newValue[1]));
  // }

  return (
    <div>
      {/* //   <ThemeProvider theme={theme}>
  //     <Box sx={{ width: { xs: 100, sm: 150, md: 200, lg: 275 } }}>
  //       <p className='mb-4 text-xl font-semibold text-gray-200'>Filter by Price</p>
  //       <Slider
  //         sx={{ color: 'blue' }}
  //         getAriaLabel={() => 'Price range'}
  //         value={value}
  //         onChange={handleChange}
  //         valueLabelDisplay="auto"
  //         getAriaValueText={valuetext}
  //         disableSwap
  //         step={2}
  //         min={min}
  //         max={max}
  //       />
  //     </Box>
  //   </ThemeProvider> */}
    </div>
  );
}
