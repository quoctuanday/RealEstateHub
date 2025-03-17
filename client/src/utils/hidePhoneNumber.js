export default function maskPhoneNumber(phone) {
    if (!phone) return '';
    const visiblePart = phone.slice(0, 4);
    const maskedPart = '*'.repeat(phone.length - 4);
    return visiblePart + maskedPart;
}
