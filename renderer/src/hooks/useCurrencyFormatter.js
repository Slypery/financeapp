import useMeta from "./useMeta";

const getLocaleSeparators = (locale) => {
    const numberFormat = new Intl.NumberFormat(locale);
    const parts = numberFormat.formatToParts(1234567.89);

    const decimal = parts.find(part => part.type === 'decimal')?.value || '.';
    const group = parts.find(part => part.type === 'group')?.value || ',';

    return { decimal, group };
}

const useCurrencyFormatter = () => {
    const meta = useMeta((s) => s.meta);

    const { decimal, group } = getLocaleSeparators(meta.locale);

    const currFormat = (value, minimumFractionDigits = 0, maximumFractionDigits= 15) => new Intl.NumberFormat(meta.locale, {
        style: 'currency',
        currency: meta.currency ?? 'IDR',
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
    }).format(value);

    const currParse = (str) => {
        const normalized = str.replaceAll(group, '').replaceAll(decimal, '.').replace(/[^\d.-]/g, '');

        return parseFloat(normalized) || 0;
    };

    return { currFormat, currParse };
}

export default useCurrencyFormatter;