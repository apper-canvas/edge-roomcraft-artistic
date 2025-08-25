import React, { useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const FileUpload = ({ 
  onFileSelect, 
  accept = "image/*", 
  multiple = true,
  className = ""
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (accept.includes("image/") && !file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        isDragOver 
          ? "border-sky bg-sky-50" 
          : "border-gray-300 hover:border-sky hover:bg-gray-50"
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <ApperIcon 
        name="Upload" 
        className="mx-auto h-12 w-12 text-gray-400 mb-4" 
      />
      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports JPG, PNG, and other image formats
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;