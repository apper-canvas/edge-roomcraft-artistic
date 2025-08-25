import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const TicketModal = ({ isOpen, onClose, onSubmit, ticket = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
    category: "",
    photos: [],
    annotations: []
  });
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "medium",
        status: ticket.status || "open",
        category: ticket.category || "",
        photos: ticket.photos || [],
        annotations: ticket.annotations || []
      });
      setUploadedPhotos(ticket.photos || []);
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "open",
        category: "",
        photos: [],
        annotations: []
      });
      setUploadedPhotos([]);
    }
    setSelectedPhoto(null);
    setIsAnnotating(false);
  }, [ticket, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files) => {
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
      annotations: []
    }));
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setFormData(prev => ({ 
      ...prev, 
      photos: [...prev.photos, ...newPhotos] 
    }));
    toast.success(`${files.length} photos uploaded successfully`);
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
      setIsAnnotating(false);
    }
    toast.success("Photo removed");
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsAnnotating(false);
  };

  const startAnnotation = () => {
    if (!selectedPhoto) {
      toast.error("Please select a photo to annotate");
      return;
    }
    setIsAnnotating(true);
    setCurrentAnnotation(null);
  };

  const handleCanvasClick = (e) => {
    if (!isAnnotating) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const annotation = {
      id: Date.now(),
      x: x / canvas.width,
      y: y / canvas.height,
      text: "",
      isEditing: true
    };

    setCurrentAnnotation(annotation);
  };

  const saveAnnotation = (text) => {
    if (!currentAnnotation || !text.trim()) return;

    const newAnnotation = {
      ...currentAnnotation,
      text: text.trim(),
      isEditing: false
    };

    setUploadedPhotos(prev => prev.map(photo => 
      photo.id === selectedPhoto.id 
        ? { ...photo, annotations: [...(photo.annotations || []), newAnnotation] }
        : photo
    ));

    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map(photo => 
        photo.id === selectedPhoto.id 
          ? { ...photo, annotations: [...(photo.annotations || []), newAnnotation] }
          : photo
      )
    }));

    setCurrentAnnotation(null);
    setIsAnnotating(false);
    toast.success("Annotation added successfully");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a ticket title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a ticket description");
      return;
    }

    onSubmit({
      ...formData,
      photos: uploadedPhotos
    });
  };

  const drawAnnotations = () => {
    if (!selectedPhoto || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = imageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw existing annotations
    const annotations = selectedPhoto.annotations || [];
    annotations.forEach(annotation => {
      const x = annotation.x * canvas.width;
      const y = annotation.y * canvas.height;

      // Draw annotation marker
      ctx.fillStyle = "#E74C3C";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw white border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw annotation number
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      ctx.fillText((annotations.indexOf(annotation) + 1).toString(), x, y + 4);
    });

    // Draw current annotation being placed
    if (currentAnnotation) {
      const x = currentAnnotation.x * canvas.width;
      const y = currentAnnotation.y * canvas.height;

      ctx.fillStyle = "#3498DB";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (selectedPhoto && imageRef.current) {
      drawAnnotations();
    }
  }, [selectedPhoto, currentAnnotation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-display font-bold text-midnight">
            {ticket ? "Edit Ticket" : "Create New Ticket"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <FormField label="Ticket Title" required>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Brief description of the issue"
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Priority" required>
                    <Select
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Select>
                  </FormField>

                  <FormField label="Category">
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="electrical">Electrical</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="painting">Painting</option>
                      <option value="flooring">Flooring</option>
                      <option value="fixtures">Fixtures</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Description" required>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed description of the issue, location, and any relevant information..."
                    className="h-32"
                  />
                </FormField>

                <FormField label="Photos">
                  <FileUpload onFileSelect={handleFileUpload} />
                </FormField>

                {uploadedPhotos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Photos ({uploadedPhotos.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className={`w-full h-32 object-cover rounded-lg cursor-pointer transition-all ${
                              selectedPhoto?.id === photo.id ? "ring-2 ring-sky" : ""
                            }`}
                            onClick={() => handlePhotoClick(photo)}
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ApperIcon name="X" className="h-3 w-3" />
                          </button>
                          {photo.annotations?.length > 0 && (
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                              {photo.annotations.length} notes
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Photo Annotation */}
              <div className="space-y-4">
                {selectedPhoto ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Annotate Photo
                      </h3>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={startAnnotation}
                        disabled={isAnnotating}
                      >
                        <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>

                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        ref={imageRef}
                        src={selectedPhoto.url}
                        alt={selectedPhoto.name}
                        className="w-full h-80 object-contain"
                        onLoad={drawAnnotations}
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full cursor-crosshair"
                        width="400"
                        height="320"
                        onClick={handleCanvasClick}
                        style={{ display: isAnnotating ? "block" : "none" }}
                      />
                    </div>

                    {currentAnnotation?.isEditing && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <FormField label="Annotation Text">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Describe the issue at this location..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveAnnotation(e.target.value);
                                }
                              }}
                              autoFocus
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={(e) => {
                                const input = e.target.parentElement.querySelector("input");
                                saveAnnotation(input.value);
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </FormField>
                      </div>
                    )}

                    {selectedPhoto.annotations?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Annotations</h4>
                        {selectedPhoto.annotations.map((annotation, index) => (
                          <div key={annotation.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <p className="text-sm text-gray-700 flex-1">
                                {annotation.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 text-gray-500 bg-gray-50 rounded-lg">
                    <ApperIcon name="Image" className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">Select a photo to annotate</p>
                    <p className="text-sm">Click on any uploaded photo to add notes</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {ticket ? "Update Ticket" : "Create Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;