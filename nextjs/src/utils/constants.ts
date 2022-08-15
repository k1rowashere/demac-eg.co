import type { categories } from "./types";
import { CookieSerializeOptions } from "next/dist/server/web/types";
import { IronSessionOptions } from "iron-session";

export const COOKIES_ATTRIBUTES: CookieSerializeOptions = { maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'lax', secure: true};

export function currencyFormater(x: number) {
    return Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(x);
};

export const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    ttl: 15 * 60, //15 mins
    cookieName: "demac-eg.co_admin_sess",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  };

export const emailTrasportOptions = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    // secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // tls: {
    //     rejectUnauthorized: false
    // }
};

export function pathsToTree(paths: { path: string }[]) {
    let tree: categories = {};
    for (const element of paths) {
        let current = tree;

        for (const segment of element.path.split('/')) {
            if (segment === '') continue;
            if (!(segment in current)) {
                current[segment] = {};
            }
            current = current[segment];
        }
    }
    return tree;
}