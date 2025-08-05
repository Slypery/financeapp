import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useTheme from "../hooks/useTheme";
import { MenuItem } from "../components/Menu";
import Dropdown from "../components/Dropdown";

function LoginLayout() {
    const location = useLocation();
    const outlet = useOutlet();
    const setTheme = useTheme((s) => s.setTheme);
    return (
        <div className="flex justify-center items-center h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'backOut' }}
                >
                    {outlet}
                </motion.div>
            </AnimatePresence>
            
            <Dropdown className="dropdown dropdown-end absolute top-0 right-0 mt-2 mr-4">
                <Dropdown.Button className="hover:underline text-sm btn btn-ghost select-none">
                    Theme
                </Dropdown.Button>
                <Dropdown.MenuContent>
                    <MenuItem onClick={() => setTheme('forest')}><button>Forest</button></MenuItem>
                    <MenuItem onClick={() => setTheme('dark')}><button>Dark</button></MenuItem>
                    <MenuItem onClick={() => setTheme('light')}><button>Light</button></MenuItem>
                    <MenuItem onClick={() => setTheme('bumblebee')}><button>Bumblebee</button></MenuItem>
                    <MenuItem onClick={() => setTheme('halloween')}><button>Halloween</button></MenuItem>
                    <MenuItem onClick={() => setTheme('valentine')}><button>Valentine</button></MenuItem>
                </Dropdown.MenuContent>
            </Dropdown>
        </div>
    )
}
export default LoginLayout;