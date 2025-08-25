import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { timelineService } from "@/services/api/timelineService";

const Timeline = () => {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const timelineData = await timelineService.getById(1);
      setTimeline(timelineData);
    } catch (err) {
      setError(err.message || "Failed to load timeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!timeline) return null;

  const getPhaseStatus = (phase) => {
    if (phase.status === "completed") return "success";
    if (phase.status === "in-progress") return "warning";
    return "default";
  };

  const getPhaseIcon = (phase) => {
    switch (phase.phase) {
      case "consultation": return "Users";
      case "design": return "Palette";
      case "approval": return "CheckCircle";
      case "procurement": return "ShoppingCart";
      case "delivery": return "Truck";
      case "installation": return "Hammer";
      default: return "Circle";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">
            Project Timeline
          </h1>
          <p className="text-gray-600 mt-1">
            Track your project progress from concept to completion
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Estimated Completion</p>
          <p className="text-lg font-semibold text-midnight">
            {new Date(timeline.estimatedCompletion).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-midnight">
            Overall Progress
          </h2>
          <Badge variant="info">{timeline.overallProgress}% Complete</Badge>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-terracotta to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${timeline.overallProgress}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-midnight">
              {timeline.phases.filter(p => p.status === "completed").length}
            </p>
            <p className="text-sm text-gray-600">Phases Complete</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-terracotta">
              {timeline.phases.filter(p => p.status === "in-progress").length}
            </p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">
              {timeline.phases.filter(p => p.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Upcoming</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-sky">
              {Math.ceil((new Date(timeline.estimatedCompletion) - new Date()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-sm text-gray-600">Days Remaining</p>
          </div>
        </div>
      </Card>

      {/* Timeline Phases */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-8">
          {timeline.phases.map((phase, index) => (
            <div key={phase.Id} className="relative">
              {/* Timeline Dot */}
              <div className={`absolute left-6 w-4 h-4 rounded-full ${
                phase.status === "completed" ? "bg-green-500" :
                phase.status === "in-progress" ? "bg-terracotta" : "bg-gray-300"
              } border-4 border-white shadow-md`}></div>
              
              {/* Phase Card */}
              <div className="ml-16">
                <Card className={`p-6 ${
                  phase.status === "in-progress" ? "ring-2 ring-terracotta ring-opacity-50" : ""
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        phase.status === "completed" ? "bg-green-100" :
                        phase.status === "in-progress" ? "bg-orange-100" : "bg-gray-100"
                      }`}>
                        <ApperIcon 
                          name={getPhaseIcon(phase)} 
                          className={`h-6 w-6 ${
                            phase.status === "completed" ? "text-green-600" :
                            phase.status === "in-progress" ? "text-terracotta" : "text-gray-600"
                          }`} 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-midnight">
                            {phase.name}
                          </h3>
                          <Badge variant={getPhaseStatus(phase)}>
                            {phase.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{phase.description}</p>
                        
                        {/* Phase Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{phase.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-sky to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${phase.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Phase Details */}
                        {phase.tasks && phase.tasks.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-900">Key Tasks:</p>
                            <div className="space-y-1">
                              {phase.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="flex items-center space-x-2 text-sm">
                                  <ApperIcon 
                                    name={task.completed ? "CheckCircle" : "Circle"} 
                                    className={`h-4 w-4 ${
                                      task.completed ? "text-green-500" : "text-gray-400"
                                    }`} 
                                  />
                                  <span className={
                                    task.completed ? "text-gray-500 line-through" : "text-gray-700"
                                  }>
                                    {task.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-600">
                      <div className="mb-1">
                        <span className="block">Start:</span>
                        <span className="font-medium">
                          {new Date(phase.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="block">End:</span>
                        <span className="font-medium">
                          {new Date(phase.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phase Actions */}
                  {phase.status === "in-progress" && phase.actionRequired && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <ApperIcon name="AlertTriangle" className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">
                            Action Required
                          </p>
                          <p className="text-sm text-yellow-700">
                            {phase.actionRequired}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Milestones */}
      <Card className="p-6">
        <h2 className="text-xl font-display font-semibold text-midnight mb-6">
          Upcoming Milestones
        </h2>
        
        <div className="space-y-4">
          {timeline.upcomingMilestones?.map((milestone) => (
            <div key={milestone.Id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-sky-100 rounded-lg">
                <ApperIcon name="Flag" className="h-4 w-4 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{milestone.name}</p>
                <p className="text-sm text-gray-600">{milestone.description}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p className="font-medium">
                  {new Date(milestone.date).toLocaleDateString()}
                </p>
                <p>{milestone.phase}</p>
              </div>
            </div>
          )) || (
            <p className="text-gray-500 text-center py-4">
              No upcoming milestones scheduled
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Timeline;