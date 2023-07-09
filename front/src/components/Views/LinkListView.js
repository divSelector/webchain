import { useState, useEffect } from "react";
import ModalDialogue from "../Overlays/ModalDialogue";


export default function LinkListView({ linksPassed, action }) {

    const [links, setLinks] = useState([]);
    const [selectedLink, setSelectedLink] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => setShowModal(!showModal);;

    const handleClick = (link) => {
        setSelectedLink(link);
        toggleModal();
      };

    useEffect(() => {
        if (linksPassed) setLinks(linksPassed)
    }, [linksPassed])

    return (
        <>
            <ul>
            {links.map((link) => (
                <li key={link.id}>
                    <p className="webring-page-link-button-group">
                        <button onClick={() => handleClick(link)}>{action.text}</button>
                        <a href={'../../page/'+link.page.id}>{link.page.title}</a> by {link.page.account.name}
                    </p>
                </li>
            ))}
            </ul>
            <ModalDialogue 
                isOpen={showModal}
                title="Confirmation"
                message="Are you sure you want to perform this action?"
                onConfirm={() => {
                    action.func(selectedLink)
                    toggleModal()
                }}
                onCancel={toggleModal}
            />
        </>
    )
}