import Navbar from "./Navbar"

export default function Header({ token, setToken }) {
    return (
        <header>
          <h1>webchain</h1>
          <Navbar token={token} setToken={setToken} />
        </header>
    )
}