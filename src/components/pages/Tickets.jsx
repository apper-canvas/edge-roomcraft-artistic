import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import TicketModal from "@/components/molecules/TicketModal";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { ticketService } from "@/services/api/ticketService";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800", 
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
  };

  const statusColors = {
    open: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800"
  };

  const loadTickets = async () => {
    try {
      setError("");
      setLoading(true);
const ticketData = await ticketService.getAll();
      const mappedTickets = ticketData.map(ticket => ({
        Id: ticket.Id,
        title: ticket.title_c || ticket.title,
        description: ticket.description_c || ticket.description,
        priority: ticket.priority_c || ticket.priority,
        status: ticket.status_c || ticket.status,
        category: ticket.category_c || ticket.category,
        photos: ticket.photos_c ? JSON.parse(ticket.photos_c) : (ticket.photos || []),
        annotations: ticket.annotations_c ? JSON.parse(ticket.annotations_c) : (ticket.annotations || []),
        assignedTo: ticket.assigned_to_c || ticket.assignedTo,
        createdAt: ticket.CreatedDate || ticket.createdAt,
        updatedAt: ticket.LastModifiedDate || ticket.updatedAt
      }));
      setTickets(mappedTickets);
      setFilteredTickets(ticketData);
    } catch (err) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;

      return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
    });

    // Sort tickets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, priorityFilter, statusFilter, categoryFilter, sortBy]);

  const handleCreateTicket = async (ticketData) => {
    try {
      const newTicket = await ticketService.create(ticketData);
      setTickets(prev => [newTicket, ...prev]);
      setIsModalOpen(false);
      setSelectedTicket(null);
      toast.success("Ticket created successfully!");
    } catch (err) {
      toast.error("Failed to create ticket");
    }
  };

  const handleEditTicket = async (ticketData) => {
    try {
      const updatedTicket = await ticketService.update(selectedTicket.Id, ticketData);
      setTickets(prev => prev.map(ticket => 
        ticket.Id === selectedTicket.Id ? updatedTicket : ticket
      ));
      setIsModalOpen(false);
      setSelectedTicket(null);
      toast.success("Ticket updated successfully!");
    } catch (err) {
      toast.error("Failed to update ticket");
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const updatedTicket = await ticketService.update(ticketId, { status: newStatus });
      setTickets(prev => prev.map(ticket => 
        ticket.Id === ticketId ? updatedTicket : ticket
      ));
      toast.success(`Ticket status changed to ${newStatus.replace("-", " ")}`);
    } catch (err) {
      toast.error("Failed to update ticket status");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await ticketService.delete(ticketId);
      setTickets(prev => prev.filter(ticket => ticket.Id !== ticketId));
      toast.success("Ticket deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete ticket");
    }
  };

  const openEditModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTickets} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">
            Tickets & Issues
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage project issues and snags
          </p>
        </div>
        <Button onClick={openCreateModal} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tickets", count: tickets.length, color: "text-blue-600", icon: "Ticket" },
          { label: "Open", count: tickets.filter(t => t.status === "open").length, color: "text-blue-600", icon: "AlertCircle" },
          { label: "In Progress", count: tickets.filter(t => t.status === "in-progress").length, color: "text-purple-600", icon: "Clock" },
          { label: "Critical", count: tickets.filter(t => t.priority === "critical").length, color: "text-red-600", icon: "AlertTriangle" }
        ].map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              </div>
              <ApperIcon name={stat.icon} className={`h-6 w-6 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Filter & Search</h2>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setPriorityFilter("all");
                setStatusFilter("all");
                setCategoryFilter("all");
                setSortBy("created");
              }}
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search tickets..."
              className="lg:col-span-2"
            />

            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>

            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>

            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="created">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
              <option value="status">Sort by Status</option>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="painting">Painting</option>
              <option value="flooring">Flooring</option>
              <option value="fixtures">Fixtures</option>
              <option value="other">Other</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <Empty 
          title="No tickets found"
          description={tickets.length === 0 ? "Create your first ticket to get started" : "Try adjusting your filters"}
          actionLabel={tickets.length === 0 ? "Create Ticket" : "Clear Filters"}
          onAction={tickets.length === 0 ? openCreateModal : () => {
            setSearchTerm("");
            setPriorityFilter("all");
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.Id} className="p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    {ticket.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={priorityColors[ticket.priority]}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    <Badge className={statusColors[ticket.status]}>
                      {ticket.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(ticket)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit ticket"
                  >
                    <ApperIcon name="Edit3" className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.Id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Delete ticket"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {ticket.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>#{ticket.Id.toString().padStart(4, '0')}</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>

              {ticket.photos && ticket.photos.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Camera" className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {ticket.photos.length} photo{ticket.photos.length !== 1 ? 's' : ''}
                    </span>
                    {ticket.photos.some(p => p.annotations?.length > 0) && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Annotated
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    {ticket.photos.slice(0, 3).map((photo, index) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt={`Ticket photo ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                    {ticket.photos.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                        +{ticket.photos.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {ticket.category && (
                <div className="mb-4">
                  <Badge className="bg-gray-100 text-gray-800">
                    {ticket.category}
                  </Badge>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.Id, e.target.value)}
                  className="flex-1 text-sm"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Select>
                <Button
                  variant={ticket.priority}
                  size="sm"
                  onClick={() => openEditModal(ticket)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        onSubmit={selectedTicket ? handleEditTicket : handleCreateTicket}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default Tickets;