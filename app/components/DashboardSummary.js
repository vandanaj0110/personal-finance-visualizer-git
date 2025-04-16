'use client';

import { expenseCategories, getCategoryById } from '../utils/categories';

export default function DashboardSummary({ transactions }) {
  // Get the current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Format amount to rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });
  
  // Calculate totals for current month
  const monthlyExpenses = currentMonthTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const monthlyIncome = currentMonthTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  // Get top expense category
  const expenseCategorySums = {};
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      if (!expenseCategorySums[tx.category]) {
        expenseCategorySums[tx.category] = 0;
      }
      expenseCategorySums[tx.category] += tx.amount;
    });
    
  let topCategory = { id: null, total: 0 };
  Object.entries(expenseCategorySums).forEach(([id, total]) => {
    if (total > topCategory.total) {
      topCategory = { id, total };
    }
  });
  
  const topCategoryInfo = topCategory.id ? getCategoryById(topCategory.id, 'expense') : null;
  
  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Month Overview - {monthNames[currentMonth]} {currentYear}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Monthly Spending</p>
          <p className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</p>
          {monthlyExpenses > 0 && monthlyIncome > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((monthlyExpenses / monthlyIncome) * 100)}% of income
            </p>
          )}
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Monthly Income</p>
          <p className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</p>
          <p className="text-sm text-gray-500 mt-1">
            Balance: <span className={monthlyIncome - monthlyExpenses >= 0 ? "text-green-600" : "text-red-600"}>
              {formatCurrency(monthlyIncome - monthlyExpenses)}
            </span>
          </p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Top Expense Category</p>
          {topCategoryInfo ? (
            <>
              <p className="text-xl font-semibold flex items-center">
                <span className="mr-2">{topCategoryInfo.icon}</span>
                {topCategoryInfo.name}
              </p>
              <p className="text-lg font-bold mt-1">{formatCurrency(topCategory.total)}</p>
            </>
          ) : (
            <p className="text-lg">No expenses yet</p>
          )}
        </div>
      </div>
    </div>
  );
}