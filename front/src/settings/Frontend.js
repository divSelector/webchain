function FrontendSettings () {
    
    const host = process.env.REACT_APP_FRONTEND_HOST
    const stripePriceLookupKey = process.env.REACT_APP_STRIPE_PRICE_LOOKUP_KEY

    return (
        {
            host: host,
            login: "/login",
            register: "/register",
            loginHelp: "/login/help",
            verifyEmail: "/email/confirm",
            verifyEmailToken: "/email/confirm/:verifyToken",
            resetPassword: "/password-reset/confirm/:userId/:resetToken",
            getBaseUrl: () => host,
            storageKeyName: "MOTHERFUCKINGSESSIONKEY",
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            pages: "/pages",
            webrings: "/webrings",
            account: "/account",
            stripePriceLookupKey: stripePriceLookupKey,
            cacheTime: 300
        }
    )
}

const front = FrontendSettings()

export default front