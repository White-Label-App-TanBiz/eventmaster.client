import React, { useState } from "react";
import { Settings, CheckCircle, XCircle, Copy, Download, BarChart3, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { PaymentGateway } from "../../../../types";
import { mockPaymentGateways } from "../../../../data/mockData";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { useNotifications } from "../../../../hooks/useNotifications";
import LoadingButton from "../../../../components/LoadingButton";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const PaymentGateways: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { isLoading, withLoading } = useLoadingState();
  const { isOpen, options, isLoading: confirmationLoading, confirm, handleConfirm, handleCancel } = useConfirmation();
  const { showSuccess, showError, showInfo } = useNotifications();

  const [selectedGateway, setSelectedGateway] = useState(mockPaymentGateways[0]);
  const [gateways, setGateways] = useState(mockPaymentGateways);
  const [manualInstructions, setManualInstructions] = useState(
    "Please send payment via bank transfer to:\n\nBank: Example Bank\nAccount Name: EventMaster Inc.\nAccount Number: 123456789\nRouting Number: 987654321\nReference: Invoice #{invoice_number}\n\nPlease email payment confirmation to billing@eventmaster.com"
  );

  const getGatewayIcon = (name: string) => {
    switch (name) {
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

  const getGatewayName = (name: string) => {
    switch (name) {
      case "stripe":
        return "Stripe";
      case "paypal":
        return "PayPal";
      case "manual":
        return "Manual Payment";
      default:
        return name;
    }
  };

  const handleGatewayAction = async (action: string, gateway: any) => {
    const actionKey = `${action}-${gateway.id}`;

    try {
      switch (action) {
        case "enable":
          confirm(
            {
              title: "Enable Payment Gateway",
              message: `Are you sure you want to enable ${getGatewayName(gateway.name)}? This will make it available for processing payments.`,
              confirmText: "Enable Gateway",
              cancelText: "Cancel",
              type: "success",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              const updatedGateways = gateways.map((g) => (g.id === gateway.id ? { ...g, isActive: true } : g));
              setGateways(updatedGateways);

              // Update selected gateway if it's the one being modified
              if (selectedGateway.id === gateway.id) {
                setSelectedGateway({ ...selectedGateway, isActive: true });
              }

              showSuccess("Gateway enabled!", `${getGatewayName(gateway.name)} has been enabled and is now available for processing payments.`);
            }
          );
          break;

        case "disable":
          confirm(
            {
              title: "Disable Payment Gateway",
              message: `Are you sure you want to disable ${getGatewayName(gateway.name)}? This will prevent it from processing new payments.`,
              confirmText: "Disable Gateway",
              cancelText: "Cancel",
              type: "warning",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              const updatedGateways = gateways.map((g) => (g.id === gateway.id ? { ...g, isActive: false } : g));
              setGateways(updatedGateways);

              // Update selected gateway if it's the one being modified
              if (selectedGateway.id === gateway.id) {
                setSelectedGateway({ ...selectedGateway, isActive: false });
              }

              showSuccess("Gateway disabled!", `${getGatewayName(gateway.name)} has been disabled and will not process new payments.`);
            }
          );
          break;

        case "test":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate test transaction
            showSuccess("Test successful!", `${getGatewayName(gateway.name)} connection test completed successfully.`);
          });
          break;

        case "configure":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate configuration load
            showInfo("Configuration loaded", `Opening configuration settings for ${getGatewayName(gateway.name)}.`);
          });
          break;

        case "view-transactions":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate data loading
            showInfo("Transactions loaded", `Viewing transaction history for ${getGatewayName(gateway.name)}.`);
          });
          break;

        default:
          showError("Unknown action", "The requested action is not supported.");
          break;
      }
    } catch (error) {
      showError("Action failed", `Failed to ${action} gateway. Please try again.`);
    }
  };

  const handleToggleGateway = (gatewayId: string) => {
    const gateway = gateways.find((g) => g.id === gatewayId);
    if (gateway) {
      handleGatewayAction(gateway.isActive ? "disable" : "enable", gateway);
    }
  };

  const handleSaveConfiguration = async () => {
    await withLoading("save-config", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      showSuccess("Configuration saved!", `Settings for ${getGatewayName(selectedGateway.name)} have been updated successfully.`);
    });
  };

  const handleTestConnection = async () => {
    if (selectedGateway.name !== "manual") {
      if (!selectedGateway.configuration.publicKey || !selectedGateway.configuration.secretKey) {
        showError("Configuration incomplete", "Please configure your API keys before testing the connection.");
        return;
      }
    }

    await handleGatewayAction("test", selectedGateway);
  };

  const handleExportReport = async () => {
    await withLoading("export-report", async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate report generation
      showSuccess("Report exported!", "Payment gateway report has been generated and downloaded.");
    });
  };

  const handleCopyToClipboard = async (text: string, type: string = "text") => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Copied!", `${type} has been copied to clipboard.`);
    } catch (error) {
      showError("Copy failed", "Failed to copy to clipboard. Please try again.");
    }
  };

  const handleUpdateInstructions = async () => {
    await withLoading("update-instructions", async () => {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call
      showSuccess("Instructions updated!", "Manual payment instructions have been saved successfully.");
    });
  };

  // Static payment statistics
  const paymentStatistics = {
    totalVolume: 45780,
    totalTransactions: 1234,
    overallSuccessRate: 98.7,
    totalFeesCollected: 1267.78,
    growth: {
      volume: { value: 12.5, trend: "up" },
      transactions: { value: 8.3, trend: "up" },
      successRate: { value: 0.2, trend: "up" },
      fees: { value: 2.8, trend: "down" },
    },
  };

  // Gateway breakdown data that adds up to the payment statistics
  const getGatewayBreakdownData = (gateway: PaymentGateway) => {
    const baseBreakdownData = {
      stripe: {
        totalVolume: 28450,
        transactions: 742,
        successRate: 99.2,
        feesCollected: 825.05,
      },
      paypal: {
        totalVolume: 12680,
        transactions: 356,
        successRate: 97.8,
        feesCollected: 442.73,
      },
      manual: {
        totalVolume: 4650,
        transactions: 136,
        successRate: 94.5,
        feesCollected: 0,
      },
    };

    return baseBreakdownData[gateway.name] || baseBreakdownData.stripe;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Gateways</h1>
        <div className="flex space-x-3">
          <LoadingButton onClick={handleExportReport} isLoading={isLoading("export-report")} loadingText="Generating..." variant="secondary" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </LoadingButton>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(paymentStatistics.totalVolume)}</div>
            <div className="text-sm text-gray-500 dark:text-zinc-400">Total Volume</div>
            <div className={`text-xs mt-1 flex items-center space-x-1 ${paymentStatistics.growth.volume.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {paymentStatistics.growth.volume.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{paymentStatistics.growth.volume.value}% this month</span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{paymentStatistics.totalTransactions.toLocaleString()}</div>
            <div className="text-sm text-gray-500 dark:text-zinc-400">Transactions</div>
            <div className={`text-xs mt-1 flex items-center space-x-1 ${paymentStatistics.growth.transactions.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {paymentStatistics.growth.transactions.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{paymentStatistics.growth.transactions.value}% this month</span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{paymentStatistics.overallSuccessRate}%</div>
            <div className="text-sm text-gray-500 dark:text-zinc-400">Success Rate</div>
            <div className={`text-xs mt-1 flex items-center space-x-1 ${paymentStatistics.growth.successRate.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {paymentStatistics.growth.successRate.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{paymentStatistics.growth.successRate.value}% this month</span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(paymentStatistics.totalFeesCollected)}</div>
            <div className="text-sm text-gray-500 dark:text-zinc-400">Fees Collected</div>
            <div className="text-xs text-gray-400 dark:text-zinc-500 mt-1">2.8% of volume</div>
          </div>
        </div>
      </div>

      {/* Gateway Comparison Table - Breakdown of Payment Statistics */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gateway Breakdown</h3>
          <LoadingButton
            onClick={() => handleGatewayAction("view-transactions", selectedGateway)}
            isLoading={isLoading(`view-transactions-${selectedGateway.id}`)}
            loadingText="Loading..."
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>View Transactions</span>
          </LoadingButton>
        </div>

        {isLoading("fetch-gateway-data") ? (
          <div className="py-8">
            <LoadingSpinner size="lg" text="Loading gateway data..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Gateway</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Volume</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Transactions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Success Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Fees Collected</th>
                </tr>
              </thead>
              <tbody>
                {gateways.map((gateway) => {
                  const data = getGatewayBreakdownData(gateway);
                  const volumePercentage = paymentStatistics.totalVolume > 0 ? ((data.totalVolume / paymentStatistics.totalVolume) * 100).toFixed(1) : "0.0";
                  const transactionPercentage = paymentStatistics.totalTransactions > 0 ? ((data.transactions / paymentStatistics.totalTransactions) * 100).toFixed(1) : "0.0";
                  const successRateDiff = (data.successRate - paymentStatistics.overallSuccessRate).toFixed(1);
                  const transactionGrowth = Math.floor(Math.random() * 20 + 5); // Random growth for demo
                  const successRateGrowth = (Math.random() * 2 - 1).toFixed(1); // Random growth for demo

                  return (
                    <tr key={gateway.id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getGatewayIcon(gateway.name)}</div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{getGatewayName(gateway.name)}</div>
                            <div className="text-sm text-gray-500 dark:text-zinc-400 flex items-center space-x-2">
                              {gateway.isActive ? (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Active</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-red-500" />
                                  <span>Inactive</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.totalVolume)}</div>
                          <div className="text-gray-500 dark:text-zinc-400">{volumePercentage}% of total</div>
                          <div className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{Math.floor(Math.random() * 20 + 5)}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">{data.transactions.toLocaleString()}</div>
                          <div className="text-gray-500 dark:text-zinc-400">{transactionPercentage}% of total</div>
                          <div className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{transactionGrowth}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">{data.successRate}%</div>
                          <div className="text-gray-500 dark:text-zinc-400">
                            {parseFloat(successRateDiff) >= 0 ? "+" : ""}
                            {successRateDiff}% vs avg
                          </div>
                          <div className={`flex items-center space-x-1 ${parseFloat(successRateGrowth) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                            {parseFloat(successRateGrowth) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>
                              {parseFloat(successRateGrowth) >= 0 ? "+" : ""}
                              {successRateGrowth}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.feesCollected)}</div>
                          <div className="text-gray-500 dark:text-zinc-400">
                            {gateway.fees.percentage}% + {formatCurrency(gateway.fees.fixed)}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-zinc-500">{paymentStatistics.totalFeesCollected > 0 ? ((data.feesCollected / paymentStatistics.totalFeesCollected) * 100).toFixed(1) : "0.0"}% of total fees</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gateway List */}
        <div className="space-y-4">
          {gateways.map((gateway) => (
            <div
              key={gateway.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedGateway.id === gateway.id ? "border-blue-700 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700"
              }`}
              onClick={() => setSelectedGateway(gateway)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getGatewayIcon(gateway.name)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{getGatewayName(gateway.name)}</h3>
                    <div className="flex items-center space-x-2">{gateway.isActive ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}</div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    {gateway.fees.percentage}% + {formatCurrency(gateway.fees.fixed)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gateway Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-2xl">{getGatewayIcon(selectedGateway.name)}</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{getGatewayName(selectedGateway.name)}</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedGateway.isActive ? "bg-emerald-600" : "bg-red-500"}`}></div>
                  <span className="text-sm text-gray-500 dark:text-zinc-400">{selectedGateway.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Status and Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Gateway Status</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{selectedGateway.isActive ? "Gateway is active and processing payments" : "Gateway is disabled"}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <LoadingButton onClick={handleTestConnection} isLoading={isLoading(`test-${selectedGateway.id}`)} loadingText="Testing..." variant="secondary" size="sm" className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Test</span>
                  </LoadingButton>
                  <LoadingButton onClick={() => handleToggleGateway(selectedGateway.id)} variant={selectedGateway.isActive ? "danger" : "success"} size="sm">
                    {selectedGateway.isActive ? "Disable" : "Enable"}
                  </LoadingButton>
                </div>
              </div>

              {/* Fee Structure */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Fee Structure</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Percentage Fee</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={selectedGateway.fees.percentage}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        step="0.01"
                      />
                      <span className="text-sm text-gray-500 dark:text-zinc-400">%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Fixed Fee</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-zinc-400">$</span>
                      <input
                        type="number"
                        value={selectedGateway.fees.fixed}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Payment Instructions */}
              {selectedGateway.name === "manual" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">Payment Instructions</h3>
                    <button onClick={() => handleCopyToClipboard(manualInstructions, "Payment instructions")} className="flex items-center space-x-1 text-sm text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Instructions for clients (supports variables like {"{invoice_number}"}, {"{amount}"}, {"{client_name}"})
                    </label>
                    <textarea
                      value={manualInstructions}
                      onChange={(e) => setManualInstructions(e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="Enter payment instructions that will be shown to clients..."
                    />
                    <p className="text-xs text-gray-500 dark:text-zinc-400">These instructions will be displayed to clients when they select manual payment option.</p>
                    <LoadingButton onClick={handleUpdateInstructions} isLoading={isLoading("update-instructions")} loadingText="Updating..." variant="primary" size="sm">
                      Update Instructions
                    </LoadingButton>
                  </div>
                </div>
              )}

              {/* Configuration */}
              {selectedGateway.name !== "manual" && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Environment</label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent">
                        <option value="production">Production</option>
                        <option value="sandbox">Sandbox</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Public Key</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={selectedGateway.configuration.publicKey || ""}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          placeholder="Enter public key"
                        />
                        <button onClick={() => handleCopyToClipboard(selectedGateway.configuration.publicKey || "", "Public key")} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Secret Key</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="password"
                          value={selectedGateway.configuration.secretKey || ""}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                          placeholder="Enter secret key"
                        />
                        <button onClick={() => handleCopyToClipboard(selectedGateway.configuration.secretKey || "", "Secret key")} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {selectedGateway.name === "stripe" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Webhook Secret</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="password"
                            value={selectedGateway.configuration.webhookSecret || ""}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                            placeholder="Enter webhook secret"
                          />
                          <button onClick={() => handleCopyToClipboard(selectedGateway.configuration.webhookSecret || "", "Webhook secret")} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-end space-x-3">
                <button className="px-4 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                <LoadingButton onClick={handleSaveConfiguration} isLoading={isLoading("save-config")} loadingText="Saving..." variant="primary" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Save Configuration</span>
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default PaymentGateways;
