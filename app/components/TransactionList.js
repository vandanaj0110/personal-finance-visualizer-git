'use client';

import { getCategoryById } from '../utils/categories';

export default function TransactionList({ transactions, onDelete }) {
  // Calculate totals
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-3 rounded-md">
          <p className="text-sm text-green-700">Income</p>
          <p className="text-lg font-bold text-green-700">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-red-100 p-3 rounded-md">
          <p className="text-sm text-red-700">Expenses</p>
          <p className="text-lg font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className={`p-3 rounded-md ${balance >= 0 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
          <p className={`text-sm ${balance >= 0 ? 'text-blue-700' : 'text-yellow-800'}`}>Balance</p>
          <p className={`text-lg font-bold ${balance >= 0 ? 'text-blue-700' : 'text-yellow-800'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No transactions yet. Add one above!</p>
      ) : (
        <ul className="divide-y max-h-96 overflow-y-auto">
          {/* Show only the 10 most recent transactions */}
          {[...transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
            .map((tx, index) => {
              const category = getCategoryById(tx.category, tx.type);
              return (
                <li key={index} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{category.icon}</span>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-gray-500">
                        {category.name} • {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-semibold mr-3 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <button 
                      onClick={() => onDelete(index)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete transaction"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
      {transactions.length > 10 && (
        <div className="text-center mt-2">
          <p className="text-sm text-gray-500">Showing 10 most recent transactions</p>
        </div>
      )}
    </div>
  );
}