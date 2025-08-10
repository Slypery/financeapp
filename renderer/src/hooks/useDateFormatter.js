import useMeta from "./useMeta";

const useDateFormatter = () => {
    const {meta} = useMeta();
    return (dateStr, options) => {
        options = options ? options : {
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
        };
        
        const formatter = new Intl.DateTimeFormat(meta.locale, options);
        return formatter.format(new Date(dateStr ? dateStr : null));
    }
}

export default useDateFormatter;