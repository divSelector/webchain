function BackendSettings () {
    const host = import.meta.env.VITE_BACKEND_HOST
    const api = "/api/"
    const auth = "auth/"

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
            getBaseUrl: () => host + api + auth,
            getNonAuthBaseUrl: () => host + api,
            
            errors: {
                emailNotVerified: "E-mail is not verified."
            }
        }
    )
}

const back = BackendSettings()

export default back