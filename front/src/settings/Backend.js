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
            resendEmail: "register/resend-email/",
            resetPassword: "password/reset/",
            resetPasswordConfirm: "password/reset/confirm/",
            getBaseUrl: () => host + api,
            errors: {
                emailNotVerified: "E-mail is not verified."
            }
        }
    )
}