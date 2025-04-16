'use client';

import { useState } from 'react';
import { expenseCategories, incomeCategories } from '../utils/categories';

export default function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food'); // Default category
  const [errors, setErrors] = useState({});

  // Get appropriate categories based on transaction type
  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  // Update category when transaction type changes
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    // Set default category based on type
    setCategory(newType === 'expense' ? 'food' : 'salary');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const transaction = {
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
    };
    
    onAdd(transaction);
    
    // Reset form
    setDescription('');
    setAmount('');
    // Keep the same type and category for consecutive entries
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Groceries"
          />
          {errors.description && <p className="mt-1 text-red-500 text-sm">{errors.description}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.amount && <p className="mt-1 text-red-500 text-sm">{errors.amount}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 border rounded-md border-gray-300"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border-gray-300"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}