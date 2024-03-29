# Gadgets Hub website

![Homepage](/public/phone1.png)

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)

## General info

A website for mobile phones specifications, reviews and news

## Technologies

- React version: 18.2.0
- Next version: 12.3.1
- Typescript version:4.8.4
- Tailwindcss version: 3.1.8
- Prisma version: 4.5.0
- Redux toolkit version: 1.8.5
- Formik version: 2.2.9
- Axios version: 0.27.2
- Lodash version: 4.17
- Cheerio version: 1.0.0
- I18next version: 22.4.9

## Functionalities

- Get the latest news daily by scrapping [gsmarena website](https://www.gsmarena.com) and displaying them on the website.
- Display all mobile phone models from year 2019 to 2022, along with their detailed specifications, and updates them every week with the latest phones.
- Display reviews for mobile phones and update them with the latest reviews on daily basis from [gsmarena website](https://www.gsmarena.com).
- Phone finder tool to help the users search for phones using specific criteria like brand, battery size, display size and others.
- Phone comparison tool that compares between up to 3 phones along with all their specifications.
- User system with the ability to add favorite phones to the user profile to check them faster in the future.
- Mobile-friendly design compatible with all screen sizes.

## Setup

To run this project:

- Create a .env file with the following variables:
  DATABASE_URL: the database connection string
  (a supabase database is needed as the user authentication system is based on supabase auth)
  NEXT_PUBLIC_SUPABASE_URL: from supabase API settings
  NEXT_PUBLIC_SUPABASE_ANON_KEY: from supabase API settings
  RAPID_API_KEY: for translation APIs

- Install it locally using npm:

```
npm install
npm run dev
```

Or you can view a live example on vercel [Here](https://gadgets-hub.vercel.app)

![Reviews](/public/phone3.png)
![Filter](/public/phone4.png)
![Comparison](/public/phone6.png)
![Responsive design](//public/phone7.png)

### Disclaimer

The data in this website is obtained from [gsmarena website](https://www.gsmarena.com)
