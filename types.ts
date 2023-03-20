import {
  Category,
  EURPrice,
  Phone,
  PhoneQuickSpecs,
  QuickSpec,
} from "@prisma/client";

export type Page = {
  url?: string;
  active?: boolean;
  number: number;
};

export type PageData = {
  prev: string;
  next: string;
  pages: { number: number; url?: string }[];
};

export type QuickSpecs = {
  name: string;
  value: string;
};

export type Spec = {
  name: string;
  value: string;
  alias: string;
};

export interface PhoneSpec {
  value: string;
  specAlias: string;
  phoneId: number;
}

export type SpecDetail = {
  category: string;
  specs: Spec[];
};

export type PhoneDetails = {
  title: string;
  img: string;
  spec_detail: SpecDetail[];
  quick_spec: QuickSpecs[];
};

export interface DetailedPhone extends Phone {
  PhoneQuickSpecs: { quickspecName: string; value: string }[];
  PhoneSpecs: DetailedPhoneSpecs[];
}

export interface DetailedPhoneSpecs {
  specAlias: string;
  value: string;
  spec: { name: string; categoryName: string; alias: string };
}
export interface DetailedCategory extends Category {
  specs: { name: string; alias: string }[];
}

export type NewsType = {
  title: string;
  body: string;
  link: string;
  imgUrl: string;
  imgAlt: string;
  newsDate: string;
};

export type ReviewType = {
  title: string;
  link: string;
  imgUrl: string;
  reviewDate: string;
  brandName?: string;
};

export type BrandPhone = {
  name: string;
  imgUrl: string;
  url: string;
  year: number;
  description: string;
};

export interface PhoneFilter extends Phone {
  PhoneQuickSpecs: PhoneQuickSpecs[];
}

export interface PhoneWithPrice extends Phone {
  EURPrice: EURPrice;
}

export interface ArQuickSpec extends QuickSpec {
  arabicName: string;
}

export interface ArCategory extends Category {
  arabicName?: string;
  specs: {
    name: string;
    categoryName: string;
    alias: string;
    arabicName?: string;
  }[];
}

export type Brand = {
  name: string;
  arabicName: string;
  phonesNum: number;
  gsmArenaUrl: string;
  phones: { name: string }[];
  Reviews: { name: string }[];
};
