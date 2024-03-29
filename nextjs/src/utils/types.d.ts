declare global {
    type LayoutProps = React.ComponentProps<typeof import('components/Layout').default>;
}

export type categories = {
    [x: string]: categories | {};
};

export type contactInfo = {
    firstName: string;
    companyName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    mobileNumber: string;
    phoneNumber: string;
    address: string;
    message?: string;
    captchaToken: string | null;
};

export type User = {
    isLoggedIn: boolean;
};

declare module 'iron-session' {
    interface IronSessionData {
        user?: User;
    }
}
