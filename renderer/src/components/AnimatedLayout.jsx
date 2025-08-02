import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";

function AnimatedLayout() {
    const outlet = useOutlet();
    const location = useLocation();
    const key = location.pathname.split('/')[1];
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
    );
}

export default AnimatedLayout;