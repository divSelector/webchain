export default function BackendSettings () {
    const host = "http://localhost:8000"
    const api = "/api/auth/"

    return (
        {
            host: host,
            api: api,
            login: "login/",
            logout: "logout/",
            register: "register/",
            verifyEmail: "register/verify-email/",
            getBaseUrl: () => host + api
        }
    )
}