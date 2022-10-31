import { PhoneQuickSpecs } from '@prisma/client'
import _ from 'lodash'

export const getUniqueSpecNames = (quickSpecs: PhoneQuickSpecs[]) => {
    const uniqueSpecNames = _.uniqBy(quickSpecs, 'quickspecName')
    return uniqueSpecNames
}

export const getUniqueSpecValues = (quickSpecs: PhoneQuickSpecs[]) => {
    const uniqueValues = _.uniqBy(quickSpecs, 'value')
}

export const getUniqueSpecs = (quickSpecs: PhoneQuickSpecs[]) => {
    let uniquesSpecs: { name: string, options: string[] }[] = getUniqueSpecNames(quickSpecs).map(item => {
        return { id: item.quickspecName, name: item.quickspecName, options: [] }
    })
    return uniquesSpecs
}


export const getUniqueBatterySizes = (quickSpecs: PhoneQuickSpecs[]) => {
    let batterySize = getUniqueSpecs(quickSpecs).find(spec => spec.name === 'Battery size')?.options.map(option => {
        let system
        system = option.slice(0, option.indexOf('m'))
        if (system === '') {
            system = null
        }
        return {
            option: Number(system)
        }
    })
}

// let ramSize = uniquesSpecs.find(spec => spec.name === 'RAM size')?.options.map(option => {
//     let system
//     if (option.indexOf('/') !== -1) {
//         system = option.slice(0, option.indexOf('/'))
//     } else if (option.indexOf('-') !== -1) {
//         system = option.slice(0, option.indexOf('-'))
//     } else if (option.indexOf('MB') !== -1) {
//         system = '0.' + option.slice(0, option.indexOf('MB'))
//     } else {
//         system = option.slice(0, option.indexOf('G'))
//     }
//     return {
//         option: (system)
//     }
// })

// let batterySize = uniquesSpecs.find(spec => spec.name === 'Battery size')?.options.map(option => {
//     let system
//     system = option.slice(0, option.indexOf('m'))
//     if (system === '') {
//         system = null
//     }
//     return {
//         option: Number(system)
//     }
// })

// let displaySize = uniquesSpecs.find(spec => spec.name === 'Display size')?.options.map(option => {
//     return {
//         option: Number(option.slice(0, option.indexOf('"')))
//     }
// })


// let date = uniquesSpecs.find(spec => spec.name === 'Release date')?.options.map(option => {
//     let year = option.slice(option.indexOf(' '), option.indexOf(' ') + 5)
//     let month = option.slice(option.indexOf(',') + 2, option.lastIndexOf(" ")).slice(0, 3)
//     month = monthNumberFromString(month.toLowerCase())
//     let day = (option.slice(option.lastIndexOf(' ') + 1).length === 0 ? '00' : option.slice(option.lastIndexOf(' ') + 1))
//     let dateNum
//     if (option === 'Cancelled') {
//         dateNum = null
//     } else if (option.indexOf('Exp') === 0) {
//         year = option.slice(option.indexOf('2'), option.indexOf('2') + 4)
//         month = monthNumberFromString(option.slice(option.lastIndexOf(' ')).toLowerCase())
//         dateNum = year + month + '00'
//     } else if (option.slice(option.lastIndexOf(' ')).length > 2) {
//         year = option.slice(option.indexOf(' '), option.indexOf(' ') + 5)
//         month = option.slice(option.indexOf(',') + 2).slice(0, 3)
//         month = monthNumberFromString(month.toLowerCase())
//         dateNum = year + month + '00'
//     }
//     else {
//         dateNum = year + month + day
//     }
//     return {
//         option: (dateNum)
//     }
// })