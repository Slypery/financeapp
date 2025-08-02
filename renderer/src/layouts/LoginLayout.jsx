import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function LoginLayout() {
    const location = useLocation();
    const outlet = useOutlet();
    return (
        <div className="flex justify-center items-center h-screen">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0,  y: 25 }}
                    animate={{ opacity: 1,  y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'backOut' }}
                >
                    {outlet}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
export default LoginLayout;