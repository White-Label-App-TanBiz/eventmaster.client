import React, { useState } from "react";
import { Plus, Edit, Trash2, Check, MoreHorizontal, Copy, Pause, Play, Users, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockProductPlans } from "../../../../data/mockData";
import { ProductPlan } from "../../../../types";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { useNotifications } from "../../../../hooks/useNotifications";
import Modal from "../../../../components/Modal";
import AddProductPlanForm from "../../../../components/AddProductPlanForm";
import Popover from "../../../../components/Popover";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import LoadingButton from "../../../../components/LoadingButton";
import ConfirmationModal from "../../../../components/ConfirmationModal";

type PlanUsageStats = {
  [planName: string]: { subscribers: number; growth: number };
};

const Plans: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const { isLoading, withLoading } = useLoadingState();
  const { isOpen, options, isLoading: confirmationLoading, confirm, handleConfirm, handleCancel } = useConfirmation();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProductPlan | null>(null);
  const [plans, setPlans] = useState<ProductPlan[]>(mockProductPlans);

  const handleAddPlan = async (newPlanData: Omit<ProductPlan, "id" | "createdAt">) => {
    await withLoading("add-plan", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      const newPlan: ProductPlan = {
        ...newPlanData,
        id: (plans.length + 1).toString(),
        createdAt: new Date().toISOString(),
      };

      setPlans((prev) => [...prev, newPlan]);
      setShowAddModal(false);
      showSuccess("Plan created successfully!", "The new product plan has been added.");
    });
  };

  const handleUpdatePlan = async (updatedPlanData: Omit<ProductPlan, "createdAt">) => {
    await withLoading("update-plan", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setPlans((prev) => prev.map((plan) => (plan.id === updatedPlanData.id ? { ...updatedPlanData, createdAt: plan.createdAt } : plan)));

      setEditingPlan(null);
      showSuccess("Plan updated successfully!", `The "${updatedPlanData.name}" plan has been updated.`);
    });
  };

  const handleTogglePlanStatus = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    const action = plan.isActive ? "deactivate" : "activate";
    const actionText = plan.isActive ? "Deactivate" : "Activate";

    confirm(
      {
        title: `${actionText} Plan`,
        message: `Are you sure you want to ${action} the "${plan.name}" plan? ${plan.isActive ? "Customers will no longer be able to subscribe to this plan." : "This plan will become available for new subscriptions."}`,
        confirmText: `${actionText} Plan`,
        cancelText: "Cancel",
        type: plan.isActive ? "warning" : "success",
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

        setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p)));

        const actionPast = plan.isActive ? "deactivated" : "activated";
        showSuccess(`Plan ${actionPast}!`, `The plan "${plan.name}" has been ${actionPast}.`);
      },
    );
  };

  const handleCheckoutLink = (plan: ProductPlan) => {
    navigate(`/checkout/${plan.id}`);
  };

  const handlePlanAction = async (action: string, plan: ProductPlan) => {
    const actionKey = `${action}-${plan.id}`;

    try {
      switch (action) {
        case "edit":
          setEditingPlan(plan);
          break;
        case "duplicate":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

            const duplicatedPlan: ProductPlan = {
              ...plan,
              id: (plans.length + 1).toString(),
              name: `${plan.name} (Copy)`,
              createdAt: new Date().toISOString(),
            };
            setPlans((prev) => [...prev, duplicatedPlan]);
            showSuccess("Plan duplicated!", `A copy of "${plan.name}" has been created.`);
          });
          break;
        case "delete":
          confirm(
            {
              title: "Delete Plan",
              message: `Are you sure you want to permanently delete the "${plan.name}" plan? This action cannot be undone and may affect existing subscribers.`,
              confirmText: "Delete Plan",
              cancelText: "Cancel",
              type: "danger",
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
              setPlans((prev) => prev.filter((p) => p.id !== plan.id));
              showSuccess("Plan deleted!", `The plan "${plan.name}" has been removed.`);
            },
          );
          break;
        case "subscribers":
          await withLoading(actionKey, async () => {
            await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate API call
            showSuccess("Subscriber list", `Viewing subscribers for "${plan.name}".`);
          });
          break;
        default:
          showError("Unknown action", "The requested action is not supported.");
          break;
      }
    } catch (error) {
      showError("Action failed", `Failed to ${action} plan. Please try again.`);
    }
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingPlan(null);
  };

  // Static plan usage statistics
  const getPlanUsageStats = (): PlanUsageStats => {
    return {
      Starter: { subscribers: 25, growth: 5 },
      Professional: { subscribers: 45, growth: 12 },
      Enterprise: { subscribers: 32, growth: 8 },
    };
  };

  const planUsageStats = getPlanUsageStats();

  // Helper function to display plan price
  const displayPlanPrice = (plan: ProductPlan) => {
    if (plan.price === 0) {
      return "Free";
    }
    return formatCurrency(plan.price);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Plans</h1>
        <div className="flex space-x-3">
          <LoadingButton onClick={() => setShowAddModal(true)} variant="primary" className="flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Plan</span>
          </LoadingButton>
        </div>
      </div>
      {/* Loading State for Plans */}
      {isLoading("fetch-plans") ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
              <LoadingSpinner size="lg" text="Loading plans..." />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <Popover
                    trigger={
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    position="bottom-right"
                  >
                    <PopoverMenuItem icon={<ExternalLink className="w-4 h-4" />} label="Checkout Link" onClick={() => handleCheckoutLink(plan)} />
                    <PopoverMenuItem icon={<Edit className="w-4 h-4" />} label="Edit Plan" onClick={() => handlePlanAction("edit", plan)} />
                    <PopoverMenuItem icon={<Copy className="w-4 h-4" />} label="Duplicate Plan" onClick={() => handlePlanAction("duplicate", plan)} isLoading={isLoading(`duplicate-${plan.id}`)} />
                    <PopoverMenuItem icon={<Users className="w-4 h-4" />} label="View Subscribers" onClick={() => handlePlanAction("subscribers", plan)} isLoading={isLoading(`subscribers-${plan.id}`)} />
                    <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                    {plan.isActive ? (
                      <PopoverMenuItem icon={<Pause className="w-4 h-4" />} label="Deactivate Plan" onClick={() => handleTogglePlanStatus(plan.id)} className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" />
                    ) : (
                      <PopoverMenuItem icon={<Play className="w-4 h-4" />} label="Activate Plan" onClick={() => handleTogglePlanStatus(plan.id)} className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" />
                    )}
                    <PopoverMenuItem icon={<Trash2 className="w-4 h-4" />} label="Delete Plan" onClick={() => handlePlanAction("delete", plan)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" />
                  </Popover>
                </div>
                <p className="text-gray-600 dark:text-zinc-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{displayPlanPrice(plan)}</span>
                    {plan.price > 0 && <span className="text-gray-500 dark:text-zinc-400 ml-2">/{plan.billingCycle}</span>}
                  </div>
                  {plan.price === 0 && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">No payment required</p>}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-zinc-400">Max Organizers</span>
                    <span className="font-medium text-gray-900 dark:text-white">{plan.maxOrganizers === -1 ? "Unlimited" : plan.maxOrganizers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-zinc-400">Max Events</span>
                    <span className="font-medium text-gray-900 dark:text-white">{plan.maxEvents === -1 ? "Unlimited" : plan.maxEvents}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-zinc-400">Max Attendees</span>
                    <span className="font-medium text-gray-900 dark:text-white">{plan.maxAttendees === -1 ? "Unlimited" : plan.maxAttendees.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white">Features:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-400">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${plan.isActive ? "bg-emerald-600" : "bg-red-500"}`}></div>
                    <span className="text-sm text-gray-600 dark:text-zinc-400">{plan.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <LoadingButton onClick={() => handleTogglePlanStatus(plan.id)} variant={plan.isActive ? "danger" : "success"} size="sm" className="text-xs">
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </LoadingButton>
                </div>
                {/* Checkout Link Button */}
                <button
                  onClick={() => handleCheckoutLink(plan)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-xl"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Checkout Link</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plan Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const stats = planUsageStats[plan.name] || { subscribers: 0, growth: 0 };
            return (
              <div key={plan.id} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.subscribers}</div>
                <div className="text-sm text-gray-500 dark:text-zinc-400">{plan.name} subscribers</div>
                <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+{stats.growth} this month</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Add/Edit Plan Modal */}
      <Modal isOpen={showAddModal || !!editingPlan} onClose={handleModalClose} title={editingPlan ? "Edit Product Plan" : "Create New Product Plan"} size="lg">
        <AddProductPlanForm
          initialData={
            editingPlan
              ? {
                  id: editingPlan.id,
                  name: editingPlan.name,
                  description: editingPlan.description,
                  price: editingPlan.price,
                  currency: editingPlan.currency,
                  billingCycle: editingPlan.billingCycle,
                  features: editingPlan.features,
                  maxOrganizers: editingPlan.maxOrganizers,
                  maxEvents: editingPlan.maxEvents,
                  maxAttendees: editingPlan.maxAttendees,
                  isActive: editingPlan.isActive,
                }
              : undefined
          }
          onSubmit={editingPlan ? handleUpdatePlan : handleAddPlan}
          onCancel={handleModalClose}
        />
      </Modal>
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

export default Plans;
