export interface categories {
    [x: string]: categories | {};
}

export interface product {
    path: string;
    part_no: string;
    name: string;
    description: string;
    price: string;
    manufacturer_link: string;
    img_link: string;
}

export interface contactInfo {
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
