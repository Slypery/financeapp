import { useEffect, useRef, useState } from 'react';
import useCurrencyFormatter from '../hooks/useCurrencyFormatter';
import useMeta from '../hooks/useMeta';

////// I USED AI FOR THIS OBVIOUSLY

function getLocaleSeparators(locale) {
    const numberFormat = new Intl.NumberFormat(locale);
    const parts = numberFormat.formatToParts(1234567.89);

    const decimal = parts.find(part => part.type === 'decimal')?.value || '.';
    const group = parts.find(part => part.type === 'group')?.value || ',';

    return { decimal, group };
}

const CurrencyInput = ({ value = 0, getVal, ...props }) => {
    const meta = useMeta((s) => s.meta);
    const { currFormat, currParse } = useCurrencyFormatter();
    const [display, setDisplay] = useState(currFormat(value));
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.value = currFormat(value);
        handleChange();
    }, [value]);

    const handleChange = () => {
        const oldCursor = inputRef.current.selectionStart;
        const oldValue = inputRef.current.value;

        const { decimal } = getLocaleSeparators(meta.locale);

        // Determine if user just typed a decimal separator at the end
        const rawInput = oldValue.replace(/[^\d.,]/g, ''); // keep only numbers and separators
        const lastChar = rawInput.slice(-1);
        const hasJustTypedDecimal = lastChar === decimal;

        // Parse the value
        const rawValue = currParse(oldValue);

        // Format it
        let newFormatted = currFormat(rawValue);

        // If user just typed decimal and it got "lost", re-add it manually
        if (hasJustTypedDecimal && !newFormatted.includes(decimal)) {
            newFormatted = newFormatted.replace(/(\d)(\D*)$/, `$1${decimal}$2`);
        }

        setDisplay(newFormatted);

        if (getVal) getVal(rawValue);

        // Restore caret position
        requestAnimationFrame(() => {
            const inputEl = inputRef.current;
            if (!inputEl) return;

            const diff = newFormatted.length - oldValue.length;
            const newCursor = Math.max(0, Math.min(newFormatted.length, oldCursor + diff));
            inputEl.setSelectionRange(newCursor, newCursor);
        });
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            ref={inputRef}
            value={display}
            onChange={handleChange}
            {...props}
        />
    );
}

export default CurrencyInput;