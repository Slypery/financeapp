import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';

const AlertDialog = ({ id, children, className }) => {
    const [animate, setAnimate] = useState({ opacity: 0, scale: 0.5 });
    const dialogRef = useRef(null);
    useEffect(() => {
        const dialog = dialogRef.current;

        const handleClose = () => {
            setAnimate({ opacity: 0, scale: 0.5 });
        }

        const handleBtnClose = (e) => {
            if (!e.target.hasAttribute('data-btn-close')) return;
            if (e.target.closest('dialog') != dialog) return;
            dialog.close();
        }

        const handleShow = () => {
            dialog.showModal();
            setAnimate({ opacity: 1, scale: 1 });
        }

        dialog.addEventListener('show', handleShow);
        dialog.addEventListener('click', handleBtnClose);
        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('show', handleShow);
            dialog.removeEventListener('click', handleBtnClose);
            dialog.removeEventListener('close', handleClose);
        };
    }, []);
    return (
        <dialog ref={dialogRef} id={id} className="modal open:bg-black/30 duration-100">
            <motion.div
                animate={animate}
                transition={{ duration: 0.3, ease: "backOut" }}
                className={className}>
                {children}
            </motion.div>
        </dialog>
    );
}

const AlertDialogShowButton = ({ children, targetID, ...props }) => {
    return (
        <button onClick={() => document.getElementById(targetID).dispatchEvent(new Event('show'))} {...props}>
            {children}
        </button>
    )
}

const AlertDialogShowFunction = (id) => {
    document.getElementById(id).dispatchEvent(new Event('show'));
}

const AlertDialogCloseButton = ({ children, targetID, ...props }) => {
    return (
        <button onClick={() => document.getElementById(targetID).close()} {...props}>
            {children}
        </button>
    )
}

const AlertDialogCloseFunction = (targetID) => {
    document.getElementById(targetID).close();
}
export { AlertDialogShowButton, AlertDialogShowFunction, AlertDialogCloseButton, AlertDialogCloseFunction };
export default AlertDialog;