import { PhoneFilter } from "../types"
import { monthNumberFromString } from "./functions"

export const convertRAM = (option: string) => {
    let system
    if (option.indexOf('/') !== -1) {
        system = option.slice(0, option.indexOf('/'))
    } else if (option.indexOf('-') !== -1) {
        system = option.slice(0, option.indexOf('-'))
    } else if (option.indexOf('MB') !== -1) {
        system = '0.' + option.slice(0, option.indexOf('MB'))
    } else {
        system = option.slice(0, option.indexOf('G'))
    }

    return Number(system)
}

export const convertDisplaySize = (option: string) => {
    return Number(option.slice(0, option.indexOf('"')))
}

export const convertBatterySize = (option: string) => {
    let system
    system = option.slice(0, option.indexOf('m'))
    if (system === '') {
        system = null
    }
    return Number(system)
}

export const convertDate = (option: string) => {
    let year = option.slice(option.indexOf(' '), option.indexOf(' ') + 5)
    let month = option.slice(option.indexOf(',') + 2, option.lastIndexOf(" ")).slice(0, 3)
    month = monthNumberFromString(month.toLowerCase())
    let day = (option.slice(option.lastIndexOf(' ') + 1).length === 0 ? '00' : option.slice(option.lastIndexOf(' ') + 1))
    let dateNum
    if (option === 'Cancelled') {
        dateNum = null
    } else if (option.indexOf('Exp') === 0) {
        year = option.slice(option.indexOf('2'), option.indexOf('2') + 4)
        month = monthNumberFromString(option.slice(option.lastIndexOf(' ')).toLowerCase())
        dateNum = year + month + '00'
    } else if (option.slice(option.lastIndexOf(' ')).length > 2) {
        year = option.slice(option.indexOf(' '), option.indexOf(' ') + 5)
        month = option.slice(option.indexOf(',') + 2).slice(0, 3)
        month = monthNumberFromString(month.toLowerCase())
        dateNum = year + month + '00'
    }
    else {
        dateNum = year + month + day
    }
    return Number(dateNum)
}

export const convertOS = (option: string) => {
    let system
    if (option.indexOf(',') === -1) {
        system = option.slice(0)
    } else {
        system = option.slice(0, option.indexOf(','))
    }
    return system
}

export const filterSearch = (
    phones: PhoneFilter[],
    brandsFilter: string[],
    osFilter: string[],
    ramFilter: string[],
    displaySizeFilter: string[],
    batterySizeFilter: string[]
) => {
    let filteredPhones: PhoneFilter[] = []

    const brandSearch = (brandsFilter: string[], phones: PhoneFilter[]) => {
        let filteredPhones: PhoneFilter[] = []
        if (brandsFilter.length === 0) {
            return phones
        } else {
            for (let i = 0; i < brandsFilter.length; i++) {
                filteredPhones.push(...phones.filter(phone => phone.brandName === brandsFilter[i]))
            }
            return filteredPhones
        }
    }

    const osSearch = (osFilter: string[], phones: PhoneFilter[]) => {
        if (osFilter.length > 0) {
            let os = []
            for (let i = 0; i < osFilter.length; i++) {
                os.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.value === osFilter[i])))
            }
            return os
        } else {
            return phones
        }
    }


    const ramSearch = (ramFilter: string[], phones: PhoneFilter[]) => {
        if (ramFilter.length > 0) {
            let ram = []
            for (let i = 0; i < ramFilter.length; i++) {
                if (ramFilter[i] === '<4') {
                    ram.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'RAM size' && spec.value < 4)))
                } else if (ramFilter[i] === '4-8') {
                    ram.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'RAM size' && (spec.value <= 8 || spec.value >= 4))))
                } else if (ramFilter[i] === '8-12') {
                    ram.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'RAM size' && (spec.value <= 12 || spec.value >= 8))))
                } else if (ramFilter[i] === '>12') {
                    ram.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'RAM size' && spec.value > 12)))
                }
            }
            return ram
        } else { return phones }
    }

    const displaySizeSearch = (displaySizeFilter: string[], phones: PhoneFilter[]) => {
        if (displaySizeFilter.length > 0) {
            let displaySize = []
            for (let i = 0; i < displaySizeFilter.length; i++) {
                if (displaySizeFilter[i] === '<4') {
                    displaySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Display size' && spec.value < 4)))
                } else if (displaySizeFilter[i] === '4-6') {
                    displaySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Display size' && spec.value <= 6 && spec.value >= 4)))
                } else if (displaySizeFilter[i] === '6-8') {
                    displaySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Display size' && spec.value <= 8 && spec.value >= 6)))
                }
                else if (displaySizeFilter[i] === '>6') {
                    displaySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Display size' && spec.value > 6)))
                }
            }
            return displaySize
        } else return phones
    }

    const batterySizeSearch = (batterySizeFilter: string[], phones: PhoneFilter[]) => {
        if (batterySizeFilter.length > 0) {
            let batterySize = []
            for (let i = 0; i < batterySizeFilter.length; i++) {
                if (batterySizeFilter[i] === '<3000') {
                    batterySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Battery size' && spec.value < 3000)))
                } else if (batterySizeFilter[i] === '3000-4500') {
                    batterySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Battery size' && spec.value <= 4500 && spec.value >= 3000)))
                } else if (batterySizeFilter[i] === '4500-5000') {
                    batterySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Battery size' && spec.value <= 5000 && spec.value >= 4500)))
                } else if (batterySizeFilter[i] === '>5000') {
                    batterySize.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.quickspecName === 'Battery size' && spec.value > 5000)))
                }
            }
            return batterySize
        } else return phones
    }
    return batterySizeSearch(batterySizeFilter, displaySizeSearch(displaySizeFilter, ramSearch(ramFilter, osSearch(osFilter, brandSearch(brandsFilter, phones)))))





    // if (brandsFilter.length > 0) {
    //     for (let i = 0; i < brandsFilter.length; i++) {
    //         filteredPhones.push(...phones.filter(phone => phone.brandName === brandsFilter[i]))
    //     }
    // }
    // if (osFilter.length > 0) {
    //     for (let i = 0; i < osFilter.length; i++) {
    //         filteredPhones.push(...phones.filter(phone => phone.PhoneQuickSpecs.find(spec => spec.value === osFilter[i])))
    //     }
    // }
    // return filteredPhones
}
