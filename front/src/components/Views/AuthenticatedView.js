import { React } from "react";
import FrontendSettings from "../../settings/Frontend";

export default function AuthenticatedView() {

    const front = FrontendSettings()

    return (
        <>
        <h3>Hello, you are logged in.</h3>
        </> 
    )
}
