export type categories = {
    [x: string]: categories | {};
}

export type product = {
    path: string;
    part_no: string;
    name: string;
    description: string;
    price: number;
    manufacturer_link: string;
    img_link: string;
    count?: number;
}

export type contactInfo = {
    firstName: string;
    companyName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    mobile: string;
    phone: string;
    address: string;
    message?: string;
    captchaToken: string;
};
