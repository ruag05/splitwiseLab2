function getCurrencySymbol(crr) {
  switch (crr) {
    case 'USD':
      return '$';
    case 'KWD':
      return 'د.ك';
    case 'BHD':
      return 'د.ب';
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    case 'CAD':
      return '$';
    default:
      return '$';
  }
}

module.exports = { getCurrencySymbol };
