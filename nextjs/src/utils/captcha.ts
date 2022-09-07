async function captchaCheck(captchaToken: string | null | undefined): Promise<boolean> {
    // guard no recaptcha env variables
    if (!process.env.RECAPTCHA_SECRET_KEY) return false;

    // validate captcha
    if (process.env.NODE_ENV !== 'development') {
        if (!captchaToken) return false;
        const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken,
            }),
        });
        const captchaResponseJson = await captchaResponse.json();
        return Boolean(captchaResponseJson.success);
    }
    return true;
}

export default captchaCheck;
