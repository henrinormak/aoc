export function multInv(a: number, m: number): number;
export function multInv(a: bigint, m: bigint): bigint;
export function multInv(a: number | bigint, m: number | bigint): number | bigint {
	const returnNumber = typeof a === 'number' && typeof m === 'number';
	const mm = BigInt(m);
  let b: bigint = BigInt(a) % mm;

	for (let i = 1n; i < m; ++i) {
		if ((b * i) % mm === 1n) {
			return returnNumber ? Number(i) : i;
		}
  }

	return returnNumber ? 1 : 1n;
}

export function calculateChineseRemainder(a: number[], n: number[]): number;
export function calculateChineseRemainder(a: bigint[], n: bigint[]): bigint;
export function calculateChineseRemainder(a: (number | bigint)[], n: (number | bigint)[]): number | bigint {
	const returnNumber = typeof a[0] === 'number' && typeof n[0] === 'number';
  const prod = n.reduce<bigint>((total, i) => total * BigInt(i), 1n);
  let p: bigint;
  let sum = 0n;

	for (let i = 0; i < a.length; ++i) {
		p = prod / BigInt(n[i]);
		sum += BigInt(a[i]) * p * multInv(p, BigInt(n[i]));
  }

	return returnNumber ? Number(sum % prod) : sum % prod;
}

export function modulo(x: number, m: number): number;
export function modulo(x: bigint, m: bigint): bigint;
export function modulo(a: number | bigint, b: number | bigint): number | bigint {
	const returnNumber = typeof a === 'number' && typeof b === 'number';
	let x = BigInt(a);
	const m = BigInt(b);

	while (x < 0) x += m;
	return returnNumber ? Number(x % m) : x % m;
}