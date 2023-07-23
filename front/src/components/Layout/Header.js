import Navbar from "./Navbar"
import ChainSVG from "../Brand/ChainSVG"

export default function Header() {
    return (
        <header>
          <div id="heading-title-wrapper">
            <ChainSVG />
            <h1>webchain</h1>
            <ChainSVG />
          </div>
          <Navbar />
        </header>
    )
}