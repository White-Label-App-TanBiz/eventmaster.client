import React, { useState } from "react";
import { Search, Filter, Download, MoreHorizontal, Eye, RefreshCw, CreditCard, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, AlertTriangle, RotateCcw, Copy, Receipt } from "lucide-react";
import { mockTransactions } from "../../../../data/mockData";
import { Transaction } from "../../../../types";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { useNotifications } from "../../../../hooks/useNotifications";
import Modal from "../../../../components/Modal";
import Popover from "../../../../components/Popover";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import LoadingButton from "../../../../components/LoadingButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const Transactions: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { isLoading, withLoading } = useLoadingState();
  const { isOpen, options, isLoading: confirmationLoading, confirm, handleConfirm, handleCancel } = useConfirmation();
  const { showSuccess, showError } = useNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedGateway, setSelectedGateway] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    const matchesGateway = selectedGateway === "all" || transaction.gateway === selectedGateway;
    return matchesSearch && matchesStatus && matchesGateway;
  });

  // Transaction statistics
  const getTransactionStats = () => {
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const completedTransactions = transactions.filter((t) => t.status === "completed");
    const completedAmount = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const pendingTransactions = transactions.filter((t) => t.status === "pending");
    const failedTransactions = transactions.filter((t) => t.status === "failed");

    return {
      totalTransactions: transactions.length,
      totalAmount,
      completedTransactions: completedTransactions.length,
      completedAmount,
      pendingTransactions: pendingTransactions.length,
      failedTransactions: failedTransactions.length,
      successRate: transactions.length > 0 ? ((completedTransactions.length / transactions.length) * 100).toFixed(1) : "0",
    };
  };

  const transactionStats = getTransactionStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400";
      case "refunded":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400";
      case "cancelled":
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "refunded":
        return <RotateCcw className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getGatewayIcon = (gateway: string) => {
    switch (gateway) {
      case "stripe":
        return "🔷";
      case "paypal":
        return "🅿️";
      case "manual":
        return "💳";
      default:
        return "💳";
    }
  };

  const getGatewayName = (gateway: string) => {
    switch (gateway) {
      case "stripe":
        return "Stripe";
      case "paypal":
        return "PayPal";
      case "manual":
        return "Manual Payment";
      default:
        return gateway;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTransactionAction = async (action: string, transaction: Transaction) => {
    const actionKey = `${action}-${transaction.id}`;

    try {
      switch (action) {
        case "view":
          setSelectedTransaction(transaction);
          setShowDetailsModal(true);
          break;

        case "retry":
          confirm(
            {
              title: "Retry Payment",
              message: `Are you sure you want to retry the payment for ${transaction.clientName}? This will attempt to process the payment again.`,
              confirmText: "Retry Payment",
              cancelText: "Cancel",
              type: "info",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
              setTransactions((prev) => prev.map((t) => (t.id === transaction.id ? { ...t, status: "pending" } : t)));
              showSuccess("Payment retry initiated", `Payment retry has been initiated for ${transaction.clientName}.`);
            },
          );
          break;

        case "refund":
          confirm(
            {
              title: "Refund Transaction",
              message: `Are you sure you want to refund ${formatCurrency(transaction.amount)} to ${transaction.clientName}? This action cannot be undone.`,
              confirmText: "Process Refund",
              cancelText: "Cancel",
              type: "warning",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
              setTransactions((prev) =>
                prev.map((t) =>
                  t.id === transaction.id
                    ? {
                        ...t,
                        status: "refunded",
                        refundAmount: transaction.amount,
                        refundDate: new Date().toISOString(),
                      }
                    : t,
                ),
              );
              showSuccess("Refund processed", `Refund of ${formatCurrency(transaction.amount)} has been processed for ${transaction.clientName}.`);
            },
          );
          break;

        case "copy-invoice":
          await navigator.clipboard.writeText(transaction.invoiceId);
          showSuccess("Invoice ID copied", "Invoice ID has been copied to clipboard.");
          break;

        case "download-receipt":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate download
            showSuccess("Receipt downloaded", `Receipt for ${transaction.invoiceId} has been downloaded.`);
          });
          break;

        default:
          showError("Unknown action", "The requested action is not supported.");
          break;
      }
    } catch (error) {
      showError("Action failed", `Failed to ${action} transaction. Please try again.`);
    }
  };

  const handleExport = async () => {
    await withLoading("export", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate export process
      showSuccess("Export completed", "Transaction data has been exported successfully.");
    });
  };

  const PopoverMenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
    isLoading?: boolean;
  }> = ({ icon, label, onClick, className = "", isLoading = false }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <div className="flex space-x-3">
          <LoadingButton onClick={handleExport} isLoading={isLoading("export")} loadingText="Exporting..." variant="secondary" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </LoadingButton>
        </div>
      </div>

      {/* Transaction Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Total Transactions</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{transactionStats.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Total Amount</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(transactionStats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Completed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{transactionStats.completedTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Success Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{transactionStats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select value={selectedGateway} onChange={(e) => setSelectedGateway(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm">
                <option value="all">All Gateways</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="manual">Manual</option>
              </select>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State for Table */}
        {isLoading("fetch-transactions") ? (
          <div className="p-8">
            <LoadingSpinner size="lg" text="Loading transactions..." />
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 border-b border-gray-200 dark:border-zinc-800 last:border-b-0">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.clientName}</p>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{transaction.company}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 font-mono">{transaction.invoiceId}</p>
                      </div>
                      <Popover
                        trigger={
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        }
                        position="bottom-right"
                      >
                        <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleTransactionAction("view", transaction)} />
                        <PopoverMenuItem icon={<Copy className="w-4 h-4" />} label="Copy Invoice ID" onClick={() => handleTransactionAction("copy-invoice", transaction)} />
                        <PopoverMenuItem icon={<Receipt className="w-4 h-4" />} label="Download Receipt" onClick={() => handleTransactionAction("download-receipt", transaction)} isLoading={isLoading(`download-receipt-${transaction.id}`)} />
                        {transaction.status === "failed" && <PopoverMenuItem icon={<RefreshCw className="w-4 h-4" />} label="Retry Payment" onClick={() => handleTransactionAction("retry", transaction)} className="text-blue-600 dark:text-blue-400" />}
                        {transaction.status === "completed" && (
                          <PopoverMenuItem icon={<RotateCcw className="w-4 h-4" />} label="Refund" onClick={() => handleTransactionAction("refund", transaction)} className="text-yellow-600 dark:text-yellow-400" />
                        )}
                      </Popover>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span>{transaction.status}</span>
                      </span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400 flex items-center space-x-1">
                        <span>{getGatewayIcon(transaction.gateway)}</span>
                        <span>{getGatewayName(transaction.gateway)}</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(transaction.amount)}</div>
                      <div className="text-xs text-gray-500 dark:text-zinc-400">{formatDate(transaction.date)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Client Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Gateway</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.invoiceId}</div>
                          <div className="text-sm text-gray-500 dark:text-zinc-400 truncate max-w-xs">{transaction.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.clientName}</div>
                          <div className="text-sm text-gray-500 dark:text-zinc-400">{transaction.company}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(transaction.amount)}</div>
                        {transaction.refundAmount && <div className="text-xs text-blue-600 dark:text-blue-400">Refunded: {formatCurrency(transaction.refundAmount)}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span>{transaction.status}</span>
                        </span>
                        {transaction.failureReason && <div className="text-xs text-red-600 dark:text-red-400 mt-1">{transaction.failureReason}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getGatewayIcon(transaction.gateway)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{getGatewayName(transaction.gateway)}</div>
                            {transaction.paymentMethod && <div className="text-xs text-gray-500 dark:text-zinc-400">{transaction.paymentMethod}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">{formatDate(transaction.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Popover
                          trigger={
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          }
                          position="bottom-right"
                        >
                          <PopoverMenuItem icon={<Eye className="w-4 h-4" />} label="View Details" onClick={() => handleTransactionAction("view", transaction)} />
                          <PopoverMenuItem icon={<Copy className="w-4 h-4" />} label="Copy Invoice ID" onClick={() => handleTransactionAction("copy-invoice", transaction)} />
                          <PopoverMenuItem icon={<Receipt className="w-4 h-4" />} label="Download Receipt" onClick={() => handleTransactionAction("download-receipt", transaction)} isLoading={isLoading(`download-receipt-${transaction.id}`)} />
                          {transaction.status === "failed" && (
                            <PopoverMenuItem
                              icon={<RefreshCw className="w-4 h-4" />}
                              label="Retry Payment"
                              onClick={() => handleTransactionAction("retry", transaction)}
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            />
                          )}
                          {transaction.status === "completed" && (
                            <PopoverMenuItem
                              icon={<RotateCcw className="w-4 h-4" />}
                              label="Refund Transaction"
                              onClick={() => handleTransactionAction("refund", transaction)}
                              className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            />
                          )}
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="px-4 lg:px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-500 dark:text-zinc-400">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Previous</button>
              <button className="px-3 py-1 text-sm bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-md hover:from-blue-800 hover:to-cyan-800 transition-all">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Transaction Details" size="xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Invoice ID</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 dark:text-white font-mono">{selectedTransaction.invoiceId}</p>
                      <button onClick={() => handleTransactionAction("copy-invoice", selectedTransaction)}>
                        <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Amount</label>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.amount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Status</label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                        {getStatusIcon(selectedTransaction.status)}
                        <span>{selectedTransaction.status}</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Payment Gateway</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getGatewayIcon(selectedTransaction.gateway)}</span>
                      <span className="text-gray-900 dark:text-white">{getGatewayName(selectedTransaction.gateway)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Date</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedTransaction.date)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Client Admin Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Client Admin</label>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.clientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Company</label>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Description</label>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.description}</p>
                  </div>
                  {selectedTransaction.paymentMethod && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Payment Method</label>
                      <p className="text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</p>
                    </div>
                  )}
                  {selectedTransaction.metadata && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-zinc-400">Plan Details</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedTransaction.metadata.planName} ({selectedTransaction.metadata.billingCycle})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedTransaction.failureReason && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">Failure Reason</h4>
                <p className="text-sm text-red-700 dark:text-red-300">{selectedTransaction.failureReason}</p>
              </div>
            )}

            {selectedTransaction.refundAmount && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Refund Information</h4>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p>Refund Amount: {formatCurrency(selectedTransaction.refundAmount)}</p>
                  {selectedTransaction.refundDate && <p>Refund Date: {formatDate(selectedTransaction.refundDate)}</p>}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                Close
              </button>
              <LoadingButton
                onClick={() => handleTransactionAction("download-receipt", selectedTransaction)}
                isLoading={isLoading(`download-receipt-${selectedTransaction.id}`)}
                loadingText="Downloading..."
                variant="primary"
                className="flex items-center space-x-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Download Receipt</span>
              </LoadingButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options?.title || ""}
        message={options?.message || ""}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        type={options?.type}
        isLoading={confirmationLoading}
      />
    </div>
  );
};

export default Transactions;
