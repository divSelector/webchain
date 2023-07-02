export default function FrontendSettings () {
    
    const host = "http://localhost:3000"

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
            account: "/account"
        }
    )
}