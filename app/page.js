'use client';

import { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlyExpenseChart from './components/MonthlyExpenseChart';
import CategoryPieChart from './components/CategoryPieChart';
import DashboardSummary from './components/DashboardSummary';
import BudgetManager from './components/BudgetManager';
import BudgetComparisonChart from './components/BudgetComparisonChart';
import SpendingInsights from './components/SpendingInsights';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'transactions', 'add', 'budget'

  // Load transactions and budgets from local storage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Failed to parse saved transactions', error);
      }
    }
    
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets));
      } catch (error) {
        console.error('Failed to parse saved budgets', error);
      }
    }
  }, []);

  // Save transactions and budgets to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (tx) => {
    setTransactions([...transactions, tx]);
    // Switch to dashboard view after adding
    setActiveTab('dashboard');
  };

  const deleteTransaction = (index) => {
    const newTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(newTransactions);
  };
  
  const updateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
  };

  // Tab navigation
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <DashboardSummary transactions={transactions} />
            <SpendingInsights transactions={transactions} budgets={budgets} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <MonthlyExpenseChart transactions={transactions} />
              </div>
              <div>
                <CategoryPieChart transactions={transactions} />
              </div>
            </div>
            <BudgetComparisonChart transactions={transactions} budgets={budgets} />
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </>
        );
      case 'transactions':
        return (
          <>
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </>
        );
      case 'add':
        return (
          <div className="max-w-md mx-auto">
            <TransactionForm onAdd={addTransaction} />
          </div>
        );
      case 'budget':
        return (
          <>
            <BudgetManager budgets={budgets} onUpdateBudgets={updateBudgets} />
            <BudgetComparisonChart transactions={transactions} budgets={budgets} />
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">💰 Personal Finance Visualizer</h1>
      
      {/* Mobile Tabs */}
      <div className="md:hidden mb-6">
        <div className="grid grid-cols-4 border rounded-lg overflow-hidden">
          <button 
            className={`py-2 text-sm ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`py-2 text-sm ${activeTab === 'transactions' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('transactions')}
          >
            History
          </button>
          <button 
            className={`py-2 text-sm ${activeTab === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('add')}
          >
            Add New
          </button>
          <button 
            className={`py-2 text-sm ${activeTab === 'budget' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setActiveTab('budget')}
          >
            Budgets
          </button>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <TransactionForm onAdd={addTransaction} />
            <BudgetManager budgets={budgets} onUpdateBudgets={updateBudgets} />
          </div>
        </div>
        
        <div className="md:col-span-3">
          <DashboardSummary transactions={transactions} />
          <SpendingInsights transactions={transactions} budgets={budgets} />
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <MonthlyExpenseChart transactions={transactions} />
            <CategoryPieChart transactions={transactions} />
          </div>
          
          <BudgetComparisonChart transactions={transactions} budgets={budgets} />
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>
      </div>
      
      {/* Mobile Layout Content */}
      <div className="md:hidden">
        {renderTabContent()}
      </div>
    </main>
  );
}