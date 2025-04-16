'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { expenseCategories } from '../utils/categories';

export default function BudgetComparisonChart({ transactions, budgets }) {
  // Process data for the chart
  const processChartData = () => {
    // Get current month transactions
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const currentMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && 
             txDate.getFullYear() === currentYear &&
             tx.type === 'expense';
    });
    
    // Group expenses by category
    const categoryExpenses = {};
    currentMonthTransactions.forEach(tx => {
      if (!categoryExpenses[tx.category]) {
        categoryExpenses[tx.category] = 0;
      }
      categoryExpenses[tx.category] += tx.amount;
    });
    
    // Prepare data for chart
    return expenseCategories
      .filter(category => (budgets?.[category.id] || 0) > 0 || categoryExpenses[category.id] > 0)
      .map(category => {
        const actual = categoryExpenses[category.id] || 0;
        const budget = budgets?.[category.id] || 0;
        // Calculate percentage of budget used
        const percentage = budget > 0 ? Math.round((actual / budget) * 100) : 0;
        
        return {
          name: category.name,
          icon: category.icon,
          id: category.id,
          budget,
          actual,
          percentage
        };
      })
      .sort((a, b) => {
        // Sort by percentage of budget used (descending)
        if (a.budget > 0 && b.budget > 0) {
          return b.percentage - a.percentage;
        }
        // If only one has a budget, prioritize it
        if (a.budget > 0) return -1;
        if (b.budget > 0) return 1;
        // If neither has a budget, sort by actual spending
        return b.actual - a.actual;
      });
  };

  const chartData = processChartData();
  
  // Format amount to rupees
  const formatToRupees = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Custom tooltip to show budget vs actual
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-md shadow">
          <p className="font-medium">{data.icon} {data.name}</p>
          <p>Budget: {formatToRupees(data.budget)}</p>
          <p>Actual: {formatToRupees(data.actual)}</p>
          <p>
            {data.budget > 0 ? (
              <span className={data.percentage > 100 ? 'text-red-600 font-bold' : ''}>
                {data.percentage}% of budget
              </span>
            ) : (
              <span className="text-gray-500">No budget set</span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
        <p className="text-gray-500">Set budgets to see your spending comparison</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Budget vs Actual Spending</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budget" name="Budget" fill="#3b82f6" />
          <Bar dataKey="actual" name="Actual">
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.actual > entry.budget && entry.budget > 0 ? '#ef4444' : '#10b981'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}