// First, let's define a list of categories we can use across components
// Create a new file: app/utils/categories.js

export const expenseCategories = [
    { id: 'food', name: 'Food & Dining', icon: '🍔' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'utilities', name: 'Utilities', icon: '💡' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'personal', name: 'Personal Care', icon: '💇' },
    { id: 'other', name: 'Other', icon: '📋' }
  ];
  
  export const incomeCategories = [
    { id: 'salary', name: 'Salary', icon: '💰' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'investment', name: 'Investment', icon: '📈' },
    { id: 'gift', name: 'Gifts', icon: '🎁' },
    { id: 'other', name: 'Other', icon: '📋' }
  ];
  
  export const getCategoryById = (id, type) => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    return categories.find(cat => cat.id === id) || { id: 'unknown', name: 'Unknown', icon: '❓' };
  };
  
  export const getCategoryColor = (categoryId) => {
    const colorMap = {
      // Expense category colors
      food: '#FF6384',
      transport: '#36A2EB',
      utilities: '#FFCE56',
      entertainment: '#4BC0C0',
      shopping: '#9966FF',
      housing: '#FF9F40',
      healthcare: '#8AC926',
      education: '#1982C4',
      personal: '#6A4C93',
      
      // Income category colors
      salary: '#32CD32',
      business: '#20B2AA',
      investment: '#3CB371',
      gift: '#7CFC00',
      
      // Default color for "other" and unknown categories
      other: '#C9C9C9',
      unknown: '#858585'
    };
  
    return colorMap[categoryId] || colorMap.other;
  };