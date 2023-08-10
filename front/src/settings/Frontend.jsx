function FrontendSettings () {
    
    const host = import.meta.env.VITE_FRONTEND_HOST
    const stripePriceLookupKey = import.meta.env.VITE_STRIPE_PRICE_LOOKUP_KEY

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
            storageKeyName: "q",
            pages: "/pages",
            webrings: "/webrings",
            account: "/account",
            stripePriceLookupKey: stripePriceLookupKey,
            cacheTime: 20
        }
    )
}

const front = FrontendSettings()

export default front