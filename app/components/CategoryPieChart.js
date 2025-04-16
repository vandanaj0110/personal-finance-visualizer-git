'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState } from 'react';
import { expenseCategories, incomeCategories, getCategoryById, getCategoryColor } from '../utils/categories';

export default function CategoryPieChart({ transactions }) {
  const [chartType, setChartType] = useState('expense'); // 'expense' or 'income'
  
  // Process data for the chart
  const processChartData = () => {
    const filteredTransactions = transactions.filter(tx => tx.type === chartType);
    
    // Group by category
    const categoryTotals = {};
    
    filteredTransactions.forEach(tx => {
      if (!categoryTotals[tx.category]) {
        categoryTotals[tx.category] = 0;
      }
      categoryTotals[tx.category] += tx.amount;
    });
    
    // Convert to array for the chart
    const categories = chartType === 'expense' ? expenseCategories : incomeCategories;
    
    return categories
      .filter(category => categoryTotals[category.id] > 0)
      .map(category => ({
        name: category.name,
        value: categoryTotals[category.id] || 0,
        id: category.id,
        icon: category.icon
      }))
      .sort((a, b) => b.value - a.value); // Sort by value (descending)
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

  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Category Breakdown</h2>
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1 ${chartType === 'expense' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setChartType('expense')}
            >
              Expenses
            </button>
            <button 
              className={`px-3 py-1 ${chartType === 'income' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setChartType('income')}
            >
              Income
            </button>
          </div>
        </div>
        <div className="text-center py-10">
          <p className="text-gray-500">No {chartType} transactions to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Category Breakdown</h2>
        <div className="flex border rounded-md overflow-hidden">
          <button 
            className={`px-3 py-1 ${chartType === 'expense' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setChartType('expense')}
          >
            Expenses
          </button>
          <button 
            className={`px-3 py-1 ${chartType === 'income' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setChartType('income')}
          >
            Income
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, icon }) => `${icon} ${name}`}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.id} fill={getCategoryColor(entry.id)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatToRupees(value), 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Category</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="py-2 flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </td>
                    <td className="py-2 text-right">{formatToRupees(category.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}