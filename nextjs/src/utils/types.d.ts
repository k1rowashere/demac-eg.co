declare global {
    type LayoutProps = React.ComponentProps<typeof import('components/Layout').default>;
}

export type categories = {
    [x: string]: categories | {};
};

export type product = {
    path: string;
    part_no: string;
    name: string;
    description: string;
    price: number;
    manufacturer_link: string;
    img_link: string;
    count?: number;
};

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

export type User = {
    isLoggedIn: boolean;
};

declare module 'iron-session' {
    interface IronSessionData {
        user?: User;
    }
}
