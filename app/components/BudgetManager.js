'use client';

import { useState, useEffect } from 'react';
import { expenseCategories } from '../utils/categories';

export default function BudgetManager({ budgets, onUpdateBudgets }) {
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);

  // Initialize local state from props
  useEffect(() => {
    setCategoryBudgets(budgets || {});
    
    // Calculate total budget
    const total = expenseCategories.reduce((sum, category) => {
      return sum + (budgets?.[category.id] || 0);
    }, 0);
    
    setTotalBudget(total);
  }, [budgets]);

  const handleBudgetChange = (categoryId, value) => {
    // Convert to number and handle invalid inputs
    const numValue = parseFloat(value) || 0;
    
    const updatedBudgets = {
      ...categoryBudgets,
      [categoryId]: numValue
    };
    
    setCategoryBudgets(updatedBudgets);
    
    // Update total
    const newTotal = expenseCategories.reduce((sum, category) => {
      return sum + (updatedBudgets[category.id] || 0);
    }, 0);
    
    setTotalBudget(newTotal);
  };

  const handleSave = () => {
    onUpdateBudgets(categoryBudgets);
    setEditMode(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Monthly Budgets</h2>
        <button 
          onClick={() => editMode ? handleSave() : setEditMode(true)}
          className={`py-1 px-3 rounded-md ${
            editMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {editMode ? 'Save Budgets' : 'Edit Budgets'}
        </button>
      </div>

      <div className="border-b pb-2 mb-3 flex justify-between items-center">
        <span className="font-medium">Total Monthly Budget:</span>
        <span className="font-bold text-xl">{formatCurrency(totalBudget)}</span>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Category</th>
              <th className="text-right py-2">Budget Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenseCategories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="py-2 flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </td>
                <td className="py-2 text-right">
                  {editMode ? (
                    <input
                      type="number"
                      value={categoryBudgets[category.id] || ''}
                      onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                      className="border rounded-md p-1 w-24 text-right"
                      min="0"
                      step="100"
                      placeholder="0"
                    />
                  ) : (
                    formatCurrency(categoryBudgets[category.id] || 0)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}