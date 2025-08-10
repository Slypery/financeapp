import { useEffect, useRef } from "react";

const Modal = ({ children, id, className, ...props }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        const modal = modalRef.current;
        const handleBtnClose = (e) => {
            if (!e.target.hasAttribute('data-btn-close')) return;
            if (e.target.closest('dialog') != modal) return;
            modal.close();            
        }

        modal.addEventListener('click', handleBtnClose);

        return () => modal.removeEventListener('click', handleBtnClose);
    }, []);
    return (
        <dialog ref={modalRef} id={id} className={`group modal ${className}`} {...props}>
            {children}
            <form method="dialog" className="opacity-0 group-open:opacity-100 backdrop-blur-sm transition-all duration-500 modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
const ModalBox = ({ children, className, ...props }) => {
    return (
        <div className={`modal-box ${className}`} {...props}>
            {children}
        </div>
    )
}

const ModalShowButton = ({ children, targetID, ...props }) => {
    return (
        <button onClick={() => document.getElementById(targetID).showModal()} {...props}>
            {children}
        </button>
    )
}

const ModalShowFunction = (targetID) => {
    document.getElementById(targetID).showModal();
}

const ModalCloseButton = ({ children, targetID, ...props }) => {
    return (
        <button onClick={() => document.getElementById(targetID).close()} {...props}>
            {children}
        </button>
    )
}

const ModalCloseFunction = (targetID) => {
    document.getElementById(targetID).close();
}

export { ModalBox, ModalShowButton, ModalShowFunction, ModalCloseButton, ModalCloseFunction };
export default Modal;