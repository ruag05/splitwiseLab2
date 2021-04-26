function getCurrencySymbol(crr) {
    switch (crr) {
      case 'USD':
        return '$';
      case 'GBP':
        return '£';
      case 'INR':
        return '₹';
      case 'KWD':
        return 'د.ك';
      case 'EUR':
        return '€';
      default:
        return '$';
    }
  }
  
  module.exports = { getCurrencySymbol };