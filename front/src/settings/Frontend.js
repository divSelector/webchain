export default function FrontendSettings () {
    
    const host = "http://localhost:3000"

    return (
        {
            host: host,
            verifyEmail: "email/confirm",
            verifyEmailToken: "/email/confirm/:verifyToken",
            getBaseUrl: () => host,
            storageKeyName: "MOTHERFUCKINGSESSIONKEY",
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errors: {
                email_invalid: "FRONTEND NO CAN EMAIL"
            }
        }
    )
}