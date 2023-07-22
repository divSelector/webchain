import Navbar from "./Navbar"
import ChainSVG from "../Brand/ChainSVG"

export default function Header() {
    return (
        <header>
          <div id="heading-title">
          <ChainSVG width={40} height={40} spacing={10} />
          <h1>webchain</h1>
          <ChainSVG width={40} height={40} spacing={10} />
        </div>

          <Navbar />
        </header>
    )
}