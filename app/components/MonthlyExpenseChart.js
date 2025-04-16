'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MonthlyExpenseChart({ transactions }) {
  // Process data for the chart
  const processChartData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = Array(12).fill(0).map((_, idx) => ({
      name: monthNames[idx],
      expenses: 0,
      income: 0
    }));
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      
      if (transaction.type === 'expense') {
        monthlyData[month].expenses += transaction.amount;
      } else {
        monthlyData[month].income += transaction.amount;
      }
    });
    
    const currentMonth = new Date().getMonth();
    // Include current month and 5 previous months
    return monthlyData
      .map((data, index) => ({ ...data, index }))
      .filter((data) => {
        // Get index relative to current month
        const relativeIndex = (data.index - currentMonth + 12) % 12;
        return relativeIndex <= 5; // Current month and 5 previous months
      })
      .sort((a, b) => a.index - b.index); // Sort by month
  };

  const chartData = processChartData();
  
  // Format amount to rupees
  const formatToRupees = (value) => {
    return `₹${value.toFixed(2)}`;
  };
  
  if (chartData.length === 0 || chartData.every(month => month.expenses === 0 && month.income === 0)) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
        <p className="text-gray-500">Add transactions to see your monthly chart</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [formatToRupees(value), '']}
          />
          <Legend />
          <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
          <Bar dataKey="income" name="Income" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}