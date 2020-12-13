export function multInv(a: bigint, m: bigint): bigint {
  let b: bigint = a % m;

	for (let i = 1n; i < m; ++i) {
		if ((b * i) % m === 1n) {
			return i;
		}
  }

	return 1n;
}

export function calculateChineseRemainder(a: bigint[], n: bigint[]) {
  const prod = n.reduce((total, i) => total * i, 1n);
  let p: bigint;
  let sum = 0n;

	for (let i = 0; i < a.length; ++i) {
		p = prod / n[i];
		sum += a[i] * p * multInv(p, n[i]);
  }

	return sum % prod;
}

export function modulo(x: bigint, m: bigint): bigint {
	while (x < 0) x += m;
	return x % m;
}