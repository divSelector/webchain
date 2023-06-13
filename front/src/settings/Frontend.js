export default function FrontendSettings () {
    
    const host = "http://localhost:3000"

    return (
        {
            host: host,
            verifyEmail: "email/confirm",
            verifyEmailToken: "/email/confirm/:verifyToken",
            getBaseUrl: () => host
        }
    )
}