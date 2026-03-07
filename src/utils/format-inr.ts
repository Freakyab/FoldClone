export function formatInr(amount: number) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
      .format(amount)
      .replace('₹', '₹');
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}

