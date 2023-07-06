import { useState, useEffect } from "react";

export default function LinkListView({ linksPassed, action }) {

    const [links, setLinks] = useState([]);

    useEffect(() => {
        if (linksPassed) setLinks(linksPassed)
    }, [linksPassed])

    return (
        <>
            <ul>
            {links.map((link) => (
                <li key={link.id}>
                    <p className="webring-page-link-button-group">
                        <button onClick={() => action.func(link)}>{action.text}</button>
                        <a href={'../../page/'+link.page.id}>{link.page.title}</a> by {link.page.account.name}
                    </p>
                </li>
            ))}
            </ul>
        </>
    )
}