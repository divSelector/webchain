import Navbar from "./Navbar"
import ChainSVG from "../Brand/ChainSVG"
import React from 'react';

export default function Header() {
    return (
        <header>
          <div id="heading-title-wrapper">
            <ChainSVG />
            <h1>neorings</h1>
            <ChainSVG />
          </div>
          <Navbar />
        </header>
    )
}