export function formatMoney(
    value: number | string,
    showDecimal: boolean = false
  ): string {
    const number = typeof value === "string" ? parseFloat(value) : value;
  
    if (isNaN(number)) return "0";
  
    const [integer, decimal] = number.toFixed(2).split(".");
  
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return showDecimal ? `${formattedInteger}.${decimal}` : formattedInteger;
  }