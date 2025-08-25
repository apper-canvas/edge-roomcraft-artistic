import React, { useState, useEffect } from "react";
import StatusCard from "@/components/molecules/StatusCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";

const Dashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const projectData = await projectService.getById(1);
      setProject(projectData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!project) return null;

  const statusCards = [
    {
      title: "Project Status",
      value: project.status,
      description: "Current phase of your project",
      status: { type: "success", label: "On Track" },
      icon: "Activity",
      variant: "success"
    },
    {
      title: "Budget Used",
      value: `$${(project.budget * 0.65).toLocaleString()}`,
      description: `of $${project.budget.toLocaleString()} total budget`,
      status: { type: "info", label: "65%" },
      icon: "DollarSign",
      variant: "primary"
    },
    {
      title: "Days Active",
      value: "23",
      description: "Project started 23 days ago",
      icon: "Calendar",
      variant: "default"
    },
    {
      title: "Completion",
      value: "45%",
      description: "Estimated completion in 6 weeks",
      status: { type: "warning", label: "In Progress" },
      icon: "TrendingUp",
      variant: "warning"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "proposal",
      title: "New living room proposal submitted",
      description: "Sarah Chen has submitted 3 new design concepts",
      time: "2 hours ago",
      icon: "Palette"
    },
    {
      id: 2,
      type: "message",
      title: "Message from designer",
      description: "Questions about furniture preferences",
      time: "4 hours ago",
      icon: "MessageSquare"
    },
    {
      id: 3,
      type: "timeline",
      title: "Phase completed",
      description: "Initial consultation phase marked complete",
      time: "1 day ago",
      icon: "CheckCircle"
    },
    {
      id: 4,
      type: "payment",
      title: "Payment processed",
      description: "Deposit payment of $2,500 confirmed",
      time: "2 days ago",
      icon: "CreditCard"
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Review bedroom proposals",
      due: "Tomorrow",
      priority: "high"
    },
    {
      id: 2,
      title: "Approve color palette",
      due: "March 22",
      priority: "medium"
    },
    {
      id: 3,
      title: "Schedule site visit",
      due: "March 25",
      priority: "low"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-midnight">
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm">
                View All
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <ApperIcon name={activity.icon} className="h-4 w-4 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold text-midnight mb-6">
              Upcoming Tasks
            </h2>
            
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <Badge 
                      variant={
                        task.priority === "high" ? "error" : 
                        task.priority === "medium" ? "warning" : "default"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Due {task.due}</p>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6" variant="outline">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-display font-semibold text-midnight mb-6">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-16" variant="primary">
            <div className="flex flex-col items-center">
              <ApperIcon name="Upload" className="h-5 w-5 mb-1" />
              <span>Upload Photos</span>
            </div>
          </Button>
          
          <Button className="h-16" variant="secondary">
            <div className="flex flex-col items-center">
              <ApperIcon name="MessageSquare" className="h-5 w-5 mb-1" />
              <span>Message Designer</span>
            </div>
          </Button>
          
          <Button className="h-16" variant="outline">
            <div className="flex flex-col items-center">
              <ApperIcon name="Eye" className="h-5 w-5 mb-1" />
              <span>View Proposals</span>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;