'use client';

import { expenseCategories, getCategoryById } from '../utils/categories';

export default function SpendingInsights({ transactions, budgets }) {
  // Get current month
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
  
  // Calculate insights based on current month's data
  const calculateInsights = () => {
    const currentMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && 
             txDate.getFullYear() === currentYear &&
             tx.type === 'expense';
    });
    
    // Calculate total monthly expenses
    const totalExpenses = currentMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate total budget
    const totalBudget = Object.values(budgets || {}).reduce((sum, amount) => sum + amount, 0);
    
    // Group expenses by category
    const categoryExpenses = {};
    currentMonthTransactions.forEach(tx => {
      if (!categoryExpenses[tx.category]) {
        categoryExpenses[tx.category] = 0;
      }
      categoryExpenses[tx.category] += tx.amount;
    });
    
    // Find categories over budget
    const overBudgetCategories = expenseCategories
      .filter(category => {
        const budget = budgets?.[category.id] || 0;
        const spent = categoryExpenses[category.id] || 0;
        return budget > 0 && spent > budget;
      })
      .map(category => ({
        ...category,
        budget: budgets?.[category.id] || 0,
        spent: categoryExpenses[category.id] || 0,
        percentage: Math.round(((categoryExpenses[category.id] || 0) / (budgets?.[category.id] || 1)) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage);
    
    // Find categories under budget but close to limit (>80%)
    const warningCategories = expenseCategories
      .filter(category => {
        const budget = budgets?.[category.id] || 0;
        const spent = categoryExpenses[category.id] || 0;
        const percentage = budget > 0 ? (spent / budget) * 100 : 0;
        return budget > 0 && spent <= budget && percentage >= 80;
      })
      .map(category => ({
        ...category,
        budget: budgets?.[category.id] || 0,
        spent: categoryExpenses[category.id] || 0,
        percentage: Math.round(((categoryExpenses[category.id] || 0) / (budgets?.[category.id] || 1)) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage);
    
    // Find top spending category
    let topCategory = { id: null, amount: 0 };
    Object.entries(categoryExpenses).forEach(([id, amount]) => {
      if (amount > topCategory.amount) {
        topCategory = { id, amount };
      }
    });
    
    // Find largest expense transaction
    let largestExpense = currentMonthTransactions.length > 0 ? currentMonthTransactions[0] : null;
    currentMonthTransactions.forEach(tx => {
      if (tx.amount > (largestExpense?.amount || 0)) {
        largestExpense = tx;
      }
    });
    
    // Calculate budget status
    const budgetStatus = {
      overBudget: totalExpenses > totalBudget && totalBudget > 0,
      percentage: totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0,
      remaining: totalBudget - totalExpenses
    };
    
    // Calculate days left in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysLeft = daysInMonth - today.getDate();
    
    // Daily budget left (if on budget)
    const dailyBudgetLeft = budgetStatus.remaining > 0 ? budgetStatus.remaining / (daysLeft || 1) : 0;
    
    return {
      totalExpenses,
      totalBudget,
      overBudgetCategories,
      warningCategories,
      topCategory: topCategory.id ? {
        ...getCategoryById(topCategory.id, 'expense'),
        amount: topCategory.amount
      } : null,
      largestExpense,
      budgetStatus,
      daysLeft,
      dailyBudgetLeft
    };
  };
  
  const insights = calculateInsights();
  
  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
      
      {/* Budget Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="font-medium">Budget Utilization</span>
          <span className={`${insights.budgetStatus.overBudget ? 'text-red-600' : 'text-green-600'} font-bold`}>
            {insights.totalBudget > 0 ? `${insights.budgetStatus.percentage}%` : 'No budget set'}
          </span>
        </div>
        
        {insights.totalBudget > 0 && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  insights.budgetStatus.percentage >= 100 ? 'bg-red-600' : 
                  insights.budgetStatus.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(insights.budgetStatus.percentage, 100)}%` }}
              ></div>
            </div>
            
            <div className="mt-2 text-sm flex justify-between">
              <span>
                Spent: {formatCurrency(insights.totalExpenses)}
              </span>
              <span>
                Budget: {formatCurrency(insights.totalBudget)}
              </span>
            </div>
            
            <div className="mt-1 text-sm">
              {insights.budgetStatus.remaining > 0 ? (
                <p className="text-green-600">
                  You have {formatCurrency(insights.budgetStatus.remaining)} left for {monthNames[currentMonth]}.
                  {insights.daysLeft > 0 && ` (${formatCurrency(insights.dailyBudgetLeft)} per day for the next ${insights.daysLeft} days)`}
                </p>
              ) : (
                <p className="text-red-600">
                  You are over budget by {formatCurrency(Math.abs(insights.budgetStatus.remaining))} this month.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Categories Over Budget */}
      {insights.overBudgetCategories.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-red-600 mb-2">Categories Over Budget</h3>
          <ul className="space-y-2">
            {insights.overBudgetCategories.slice(0, 3).map(category => (
              <li key={category.id} className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </span>
                <span className="text-red-600 font-medium">
                  {category.percentage}% of budget
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Categories Approaching Budget */}
      {insights.warningCategories.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-yellow-600 mb-2">Approaching Budget Limit</h3>
          <ul className="space-y-2">
            {insights.warningCategories.slice(0, 3).map(category => (
              <li key={category.id} className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </span>
                <span className="text-yellow-600 font-medium">
                  {category.percentage}% of budget
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* General Insights */}
      <div className="mt-4">
        <h3 className="font-medium mb-2">This Month's Highlights</h3>
        <ul className="space-y-2 text-sm">
          {insights.topCategory && (
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">🔍</span>
              <span>
                Highest spending category: <span className="font-medium">{insights.topCategory.icon} {insights.topCategory.name}</span> 
                ({formatCurrency(insights.topCategory.amount)})
              </span>
            </li>
          )}
          
          {insights.largestExpense && (
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">📊</span>
              <span>
                Largest expense: <span className="font-medium">{insights.largestExpense.description}</span> 
                ({formatCurrency(insights.largestExpense.amount)})
              </span>
            </li>
          )}
          
          {insights.totalBudget > 0 && (
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">📅</span>
              <span>
                {insights.daysLeft} days left in {monthNames[currentMonth]}
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}