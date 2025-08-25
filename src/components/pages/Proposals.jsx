import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import ColorPalette from "@/components/molecules/ColorPalette";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { proposalService } from "@/services/api/proposalService";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const proposalData = await proposalService.getAll();
      setProposals(proposalData);
    } catch (err) {
      setError(err.message || "Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (proposalId) => {
    try {
      await proposalService.update(proposalId, { status: "approved" });
      toast.success("Proposal approved successfully!");
      loadData();
    } catch (err) {
      toast.error("Failed to approve proposal");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await proposalService.update(proposalId, { status: "rejected" });
      toast.success("Proposal status updated");
      loadData();
    } catch (err) {
      toast.error("Failed to update proposal");
    }
  };

  const handleAddComment = async (proposalId) => {
    if (!newComment.trim()) return;
    
    try {
      const comment = {
        id: Date.now(),
        content: newComment,
        author: "You",
        timestamp: new Date().toISOString(),
        type: "feedback"
      };
      
      const proposal = proposals.find(p => p.Id === proposalId);
      const updatedComments = [...(proposal.comments || []), comment];
      
      await proposalService.update(proposalId, { 
        comments: updatedComments 
      });
      
      setNewComment("");
      toast.success("Comment added successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const open3DPreview = (proposal) => {
    setSelectedProposal(proposal);
    toast.info("Opening 3D preview...");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (proposals.length === 0) {
    return (
      <Empty
        title="No Proposals Yet"
        description="Your designer is working on creating proposals for your space. You'll see them here once ready."
        icon="Palette"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">
            Design Proposals
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve your custom design proposals
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="info">{proposals.length} Proposals</Badge>
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {proposals.map((proposal) => (
          <Card key={proposal.Id} className="overflow-hidden">
            {/* Proposal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold text-midnight">
                  {proposal.roomName} Concept {proposal.Id}
                </h2>
                <Badge 
                  variant={
                    proposal.status === "approved" ? "success" : 
                    proposal.status === "rejected" ? "error" : "warning"
                  }
                >
                  {proposal.status}
                </Badge>
              </div>
              
              {/* Room Preview Image */}
              <div className="relative mb-4">
                <img
                  src={proposal.previewImage}
                  alt={`${proposal.roomName} design`}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <Button 
                    variant="secondary"
                    onClick={() => open3DPreview(proposal)}
                  >
                    <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                    3D Preview
                  </Button>
                </div>
              </div>

              {/* Color Palette */}
              <ColorPalette
                colors={proposal.colorPalette}
                title="Color Palette"
              />
            </div>

            {/* Furniture Items */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">
                Furniture & Decor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {proposal.furniture.slice(0, 4).map((item) => (
                  <div key={item.Id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-terracotta font-semibold">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {proposal.furniture.length > 4 && (
                <p className="text-sm text-gray-500 mt-3">
                  +{proposal.furniture.length - 4} more items
                </p>
              )}
            </div>

            {/* Pricing & Actions */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-midnight">
                    ${proposal.totalCost.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Timeline</p>
                  <p className="font-semibold">8-10 weeks</p>
                </div>
              </div>

              {/* Comments */}
              {proposal.comments && proposal.comments.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center text-sm text-sky hover:text-sky-700"
                  >
                    <ApperIcon name="MessageSquare" className="h-4 w-4 mr-1" />
                    {proposal.comments.length} Comments
                  </button>
                  
                  {showComments && (
                    <div className="mt-3 space-y-3 max-h-40 overflow-y-auto">
                      {proposal.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Add Comment */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a comment or request changes..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment(proposal.Id);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddComment(proposal.Id)}
                  >
                    <ApperIcon name="Send" className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {proposal.status === "pending" && (
                  <>
                    <Button 
                      className="flex-1"
                      variant="primary"
                      onClick={() => handleApprove(proposal.Id)}
                    >
                      <ApperIcon name="Check" className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(proposal.Id)}
                    >
                      <ApperIcon name="X" className="h-4 w-4 mr-2" />
                      Request Changes
                    </Button>
                  </>
                )}
                
                {proposal.status === "approved" && (
                  <Button className="w-full" variant="primary">
                    <ApperIcon name="ShoppingCart" className="h-4 w-4 mr-2" />
                    Proceed to Order
                  </Button>
                )}

                {proposal.status === "rejected" && (
                  <Button className="w-full" variant="outline">
                    <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
                    Awaiting Revision
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 3D Preview Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold">
                3D Preview - {selectedProposal.roomName}
              </h2>
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="Box" className="h-8 w-8 text-sky-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    3D Model Loading
                  </h3>
                  <p className="text-gray-500">
                    Interactive 3D preview would load here
                  </p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <Button size="sm" variant="outline">
                      <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
                      Rotate
                    </Button>
                    <Button size="sm" variant="outline">
                      <ApperIcon name="ZoomIn" className="h-4 w-4 mr-2" />
                      Zoom
                    </Button>
                    <Button size="sm" variant="outline">
                      <ApperIcon name="Move" className="h-4 w-4 mr-2" />
                      Pan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;