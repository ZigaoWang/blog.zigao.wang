export type Currency = 'CNY' | 'USD';

/** Approximate rate used across the site. Update alongside any post that quotes prices. */
export const CNY_PER_USD = 6.72;

export const STORAGE_KEY = 'currency-pref';

function digits(v: number): number {
	const abs = Math.abs(v);
	if (abs >= 100) return 0;
	if (abs >= 10) return 1;
	return 2;
}

/** Significant-ish figures, with trailing zeros dropped: 92.04 → "92", 2.944 → "2.94". */
export function formatNumber(v: number): string {
	const dp = digits(v);
	return Number(v.toFixed(dp)).toLocaleString('en-US', { maximumFractionDigits: dp });
}

/** One decimal at most, for multipliers and counts of things: 4.26 → "4.3", 2 → "2". */
export function formatRatio(v: number): string {
	return Number(v.toFixed(1)).toLocaleString('en-US', { maximumFractionDigits: 1 });
}

export function usdToCny(usd: number): number {
	return usd * CNY_PER_USD;
}

/** Like formatNumber, but small amounts keep their cents: 0.5 → "0.50", 92.04 → "92". */
function formatAmount(v: number): string {
	if (Math.abs(v) > 0 && Math.abs(v) < 10) {
		return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}
	return formatNumber(v);
}

/** For prices that are natively CNY. */
export function formatMoney(cny: number, currency: Currency = 'CNY'): string {
	if (currency === 'USD') return '$' + formatAmount(cny / CNY_PER_USD);
	return '¥' + formatAmount(cny);
}

/** For prices that are natively USD, so the dollar figure stays exact. */
export function formatFromUsd(usd: number, currency: Currency = 'CNY'): string {
	if (currency === 'USD') return '$' + formatAmount(usd);
	return '¥' + formatAmount(usdToCny(usd));
}
