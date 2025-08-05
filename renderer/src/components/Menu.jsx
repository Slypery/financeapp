import { AnimatePresence, motion } from "framer-motion"
import { createContext, useContext, useState } from "react"
import { Link } from "react-router-dom"

const Menu = ({ children, className = "", ...props }) => {
    return (
        <ul className={`menu ${className}`} {...props}>
            {children}
        </ul>
    )
}

const MenuItem = ({ children, ...props }) => {
    return (
        <li {...props}>{children}</li>
    )
}

const MenuLink = ({ children, ...props }) => {
    return (
        <li><Link {...props}>{children}</Link></li>
    )
}

const CollapsibleMenuItemContext = createContext();

const CollapsibleMenuItem = ({ children, className = "", open = false, ...props }) => {
  
  const [isOpen, setIsOpen] = useState(open);
  return (
    <CollapsibleMenuItemContext.Provider value={[ isOpen, setIsOpen ]}>
      <li className={className} {...props}>
        {children}
      </li>
    </CollapsibleMenuItemContext.Provider>
  );
};

CollapsibleMenuItem.Button = ({ children, className = "", ...props }) => {
  const [ isOpen, setIsOpen ] = useContext(CollapsibleMenuItemContext);
  return (
    <button onClick={() => setIsOpen(!isOpen)} className={`menu-dropdown-toggle ${isOpen ? "menu-dropdown-show" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
};

CollapsibleMenuItem.Content = ({ children, className = "", ...props }) => {
  const [ isOpen ] = useContext(CollapsibleMenuItemContext);
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={`menu-dropdown menu-dropdown-show overflow-hidden ${className}`}
          {...props}
        >
          {children}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export { MenuItem, MenuLink, CollapsibleMenuItem }
export default Menu;