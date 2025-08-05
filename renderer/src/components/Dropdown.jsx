import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DropdownContext = createContext();

const Dropdown = ({ children, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownContext.Provider value={[isOpen, setIsOpen]}>
            <details className={`dropdown ${className} ` + (isOpen ? 'open' : '')} open>
                {children}
            </details>
        </DropdownContext.Provider>
    );
};

Dropdown.Button = ({ children, className = "", ...props }) => {
    const [isOpen, setIsOpen] = useContext(DropdownContext);

    return (
        <summary className={className} onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen) }} {...props}>
            {children}
        </summary>
    );
};

Dropdown.MenuContent = ({ children, className = "", ...props }) => {
    const [isOpen] = useContext(DropdownContext);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.ul
                    key="dropdown-content"
                    className={`menu dropdown-content bg-base-100 border-def border-base-200 rounded-box z-1 p-2 shadow-sm ${className}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "backOut" }}
                    {...props}
                >
                    {children}
                </motion.ul>
            )}
        </AnimatePresence>
    );
};

Dropdown.Content = ({ children, className = "" }) => {
    const [isOpen] = useContext(DropdownContext);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="dropdown-content"
                    className={`menu dropdown-content bg-base-100 border-def border-base-200 rounded-box z-1 p-2 shadow-sm ${className}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "backOut" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Dropdown;
