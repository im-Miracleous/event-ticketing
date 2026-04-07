/**
 * Currency formatting utility.
 *
 * Uses the Intl.NumberFormat API so the output automatically adapts to the
 * currency code stored in the `app_settings` table (shared via Inertia).
 */

const LOCALE_MAP: Record<string, string> = {
    IDR: 'id-ID',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    SGD: 'en-SG',
    MYR: 'ms-MY',
    AUD: 'en-AU',
};

/**
 * Format a number as currency.
 *
 * @param amount   – The numeric value to format.
 * @param currency – ISO 4217 currency code (e.g. 'IDR', 'USD').
 *                   Falls back to 'IDR' when omitted.
 * @param compact  – When true, large numbers are shortened (e.g. "Rp 1jt").
 */
export function formatCurrency(
    amount: number,
    currency: string = 'IDR',
    compact: boolean = false,
): string {
    if (amount === 0) return 'Free';

    const locale = LOCALE_MAP[currency] || 'en-US';

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'IDR' ? 0 : 2,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
        ...(compact ? { notation: 'compact' as const } : {}),
    });

    return formatter.format(amount);
}
