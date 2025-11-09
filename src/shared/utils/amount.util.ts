export const formatAmount = (amount: number | string): string => {
  if (!amount) return '';

  const cleanNumber = String(amount).replace(/[^0-9.]/g, '');
  const number = parseFloat(cleanNumber);
  if (isNaN(number)) return '';

  return number.toLocaleString('en-US');
};

export const parseAmount = (formattedAmount: string): number => {
  if (!formattedAmount) return 0;

  const cleanNumber = formattedAmount.replace(/[^0-9.]/g, '');
  const number = parseFloat(cleanNumber);
  return isNaN(number) ? 0 : number;
};

export const validateAmount = (
  amount: string,
  min?: number,
  max?: number,
): boolean => {
  const parsedAmount = parseAmount(amount);
  if (parsedAmount === 0) return false;

  if (min !== undefined && parsedAmount < min) return false;
  if (max !== undefined && parsedAmount > max) return false;

  return true;
};
