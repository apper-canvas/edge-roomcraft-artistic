import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { siteVisitService } from "@/services/api/siteVisitService";
import { timelineService } from "@/services/api/timelineService";
import { toast } from "react-toastify";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month, week
  const [siteVisits, setSiteVisits] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "2",
    phase: "",
    attendees: ["client", "designer"]
  });

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [visitsData, timelineData] = await Promise.all([
        siteVisitService.getAll(),
        timelineService.getById(1)
      ]);
      setSiteVisits(visitsData);
      setTimeline(timelineData);
    } catch (err) {
      setError(err.message || "Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getVisitsForDate = (date) => {
    return siteVisits.filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setScheduleForm({
      ...scheduleForm,
      date: date.toISOString().split('T')[0],
      time: "10:00"
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const visitData = {
        ...scheduleForm,
        date: `${scheduleForm.date}T${scheduleForm.time}:00Z`,
        endDate: new Date(
          new Date(`${scheduleForm.date}T${scheduleForm.time}:00Z`).getTime() + 
          (parseInt(scheduleForm.duration) * 60 * 60 * 1000)
        ).toISOString(),
        status: "scheduled"
      };
      
      await siteVisitService.create(visitData);
      toast.success("Site visit scheduled successfully!");
      setShowScheduleModal(false);
      setScheduleForm({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "2",
        phase: "",
        attendees: ["client", "designer"]
      });
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to schedule site visit");
    }
  };

  const handleVisitStatusUpdate = async (visitId, status) => {
    try {
      await siteVisitService.update(visitId, { status });
      toast.success(`Visit ${status} successfully!`);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update visit");
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "success";
      case "scheduled": return "warning";
      case "completed": return "info";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">
            Site Visit Calendar
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage site visits for your project
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select 
            value={view} 
            onChange={(e) => setView(e.target.value)}
            className="w-32"
          >
            <option value="month">Month View</option>
            <option value="week">Week View</option>
          </Select>
          <Button 
            variant="calendar"
            onClick={() => setShowScheduleModal(true)}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Schedule Visit
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <ApperIcon name="ChevronLeft" className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-display font-semibold text-midnight">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <ApperIcon name="ChevronRight" className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-700">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {days.map((day, index) => {
            const visits = getVisitsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();
            
            return (
              <div
                key={index}
                className={`bg-white p-2 h-32 border-r border-b ${
                  !isCurrentMonth ? "text-gray-400 bg-gray-50" : ""
                } ${isToday ? "bg-blue-50 border-blue-200" : ""} 
                hover:bg-gray-50 cursor-pointer transition-colors`}
                onClick={() => handleDateClick(day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? "text-blue-600" : "text-gray-900"
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {visits.slice(0, 3).map((visit) => (
                    <div
                      key={visit.Id}
                      className={`text-xs p-1 rounded truncate ${
                        visit.status === "confirmed" ? "bg-green-100 text-green-800" :
                        visit.status === "scheduled" ? "bg-yellow-100 text-yellow-800" :
                        visit.status === "completed" ? "bg-blue-100 text-blue-800" :
                        "bg-red-100 text-red-800"
                      }`}
                    >
                      {visit.title}
                    </div>
                  ))}
                  {visits.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{visits.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upcoming Visits */}
      <Card className="p-6">
        <h2 className="text-xl font-display font-semibold text-midnight mb-6">
          Upcoming Site Visits
        </h2>
        
        <div className="space-y-4">
          {siteVisits
            .filter(visit => new Date(visit.date) > new Date() && visit.status !== "cancelled")
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((visit) => (
              <div key={visit.Id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{visit.title}</h3>
                      <Badge variant={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                      {visit.phase && (
                        <Badge variant="outline">
                          {visit.phase}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{visit.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="h-4 w-4" />
                        <span>
                          {new Date(visit.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" className="h-4 w-4" />
                        <span>
                          {new Date(visit.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Users" className="h-4 w-4" />
                        <span>{visit.attendees?.length || 0} attendees</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {visit.status === "scheduled" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleVisitStatusUpdate(visit.Id, "confirmed")}
                      >
                        Confirm
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVisitStatusUpdate(visit.Id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          
          {siteVisits.filter(visit => 
            new Date(visit.date) > new Date() && visit.status !== "cancelled"
          ).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming site visits scheduled</p>
            </div>
          )}
        </div>
      </Card>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold text-midnight">
                Schedule Site Visit
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScheduleModal(false)}
              >
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <Input
                label="Visit Title"
                value={scheduleForm.title}
                onChange={(e) => setScheduleForm({
                  ...scheduleForm,
                  title: e.target.value
                })}
                placeholder="e.g., Progress Review"
                required
              />
              
              <Textarea
                label="Description"
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm({
                  ...scheduleForm,
                  description: e.target.value
                })}
                placeholder="Visit purpose and details"
                rows={3}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({
                    ...scheduleForm,
                    date: e.target.value
                  })}
                  required
                />
                
                <Input
                  label="Time"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({
                    ...scheduleForm,
                    time: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Duration (hours)"
                  value={scheduleForm.duration}
                  onChange={(e) => setScheduleForm({
                    ...scheduleForm,
                    duration: e.target.value
                  })}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                </Select>
                
                <Select
                  label="Project Phase"
                  value={scheduleForm.phase}
                  onChange={(e) => setScheduleForm({
                    ...scheduleForm,
                    phase: e.target.value
                  })}
                >
                  <option value="">Select phase</option>
                  {timeline?.phases?.map((phase) => (
                    <option key={phase.Id} value={phase.phase}>
                      {phase.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="calendar"
                  className="flex-1"
                >
                  Schedule Visit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;