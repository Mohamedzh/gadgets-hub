export type Page = {
    url?: string
    active?: boolean
    number: number
}

export type PageData = {
    prev: string
    next: string
    pages: { number: number, url?: string }[]
}

export type QuickSpecs = {
    name: string
    value: string
}

export type Spec = {
    name: string
    value: string
    alias: string
}

export interface PhoneSpec {
    value: string
    specAlias: string
    phoneId: number
}

export type SpecDetail = {
    category: string
    specs: Spec[]
}

export type PhoneDetails = {
    title: string
    img: string
    spec_detail: SpecDetail[]
    quick_spec: QuickSpecs[]
}