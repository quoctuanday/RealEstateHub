function formatMoneyShort(value) {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(
            value % 1_000_000_000 === 0 ? 0 : 1
        )} tỷ`;
    } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(
            value % 1_000_000 === 0 ? 0 : 1
        )} triệu`;
    } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)} nghìn`;
    } else {
        return value.toString();
    }
}
export default formatMoneyShort;
