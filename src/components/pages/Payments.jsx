import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { paymentService } from "@/services/api/paymentService";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [paymentData, summaryData] = await Promise.all([
        paymentService.getAll(),
        paymentService.getSummary()
      ]);
      setPayments(paymentData);
      setPaymentSummary(summaryData);
    } catch (err) {
      setError(err.message || "Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayment = async (paymentId) => {
    try {
      toast.info("Redirecting to secure payment portal...");
      // In a real app, this would redirect to payment processor
      setTimeout(() => {
        toast.success("Payment completed successfully!");
      }, 2000);
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "overdue": return "error";
      case "scheduled": return "info";
      default: return "default";
    }
  };

  const getPaymentIcon = (type) => {
    switch (type) {
      case "deposit": return "DollarSign";
      case "milestone": return "Flag";
      case "final": return "CheckCircle";
      default: return "CreditCard";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (payments.length === 0) {
    return (
      <Empty
        title="No Payments"
        description="Payment schedule will appear here once your project begins"
        icon="CreditCard"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">
            Payments & Billing
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your project payments and view invoices
          </p>
        </div>
        <Button variant="outline">
          <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
          View All Invoices
        </Button>
      </div>

      {/* Payment Summary */}
      {paymentSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-700">
                  ${paymentSummary.totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <ApperIcon name="CheckCircle" className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">
                  ${paymentSummary.totalPending.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-lg">
                <ApperIcon name="Clock" className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${paymentSummary.totalBudget.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <ApperIcon name="Target" className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-purple-700">
                  ${(paymentSummary.totalBudget - paymentSummary.totalPaid).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <ApperIcon name="Wallet" className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payment Schedule */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-display font-semibold text-midnight">
            Payment Schedule
          </h2>
          <p className="text-gray-600 mt-1">
            Track your project milestones and payment schedule
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-sky-100 rounded-lg mr-3">
                        <ApperIcon 
                          name={getPaymentIcon(payment.type)} 
                          className="h-4 w-4 text-sky-600" 
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.milestone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((payment.amount / paymentSummary?.totalBudget) * 100).toFixed(0)}% of total
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.status === "overdue" 
                        ? "Overdue"
                        : `${Math.ceil((new Date(payment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      {(payment.status === "pending" || payment.status === "overdue") && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handlePayment(payment.Id)}
                        >
                          Pay Now
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <ApperIcon name="Eye" className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-midnight">
            Recent Transactions
          </h2>
          <Button variant="ghost" size="sm">
            View All
            <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-4">
          {payments.filter(p => p.status === "paid").slice(0, 3).map((payment) => (
            <div key={payment.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{payment.description}</p>
                  <p className="text-sm text-gray-600">
                    Paid on {new Date(payment.paidDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${payment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{payment.method}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold">
                Payment Details
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span>{selectedPayment.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">${selectedPayment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span>{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedPayment.status)}>
                        {selectedPayment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Project Milestone</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Milestone:</span>
                      <span>{selectedPayment.milestone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{selectedPayment.type}</span>
                    </div>
                    {selectedPayment.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid Date:</span>
                        <span>{new Date(selectedPayment.paidDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                  Close
                </Button>
                {(selectedPayment.status === "pending" || selectedPayment.status === "overdue") && (
                  <Button variant="primary" onClick={() => handlePayment(selectedPayment.Id)}>
                    <ApperIcon name="CreditCard" className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;