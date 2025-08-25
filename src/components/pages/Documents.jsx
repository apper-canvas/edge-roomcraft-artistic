import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { documentService } from "@/services/api/documentService";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const documentData = await documentService.getAll();
      setDocuments(documentData);
      setFilteredDocuments(documentData);
    } catch (err) {
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = documents;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  }, [documents, selectedCategory, searchQuery]);

const categories = [
    { value: "all", label: "All Documents", count: documents.length },
    { value: "quotes", label: "Quotes", count: documents.filter(d => d.category === "quotes").length },
    { value: "drawings", label: "Drawings", count: documents.filter(d => d.category === "drawings").length },
    { value: "warranties", label: "Warranties", count: documents.filter(d => d.category === "warranties").length },
    { value: "contracts", label: "Contracts", count: documents.filter(d => d.category === "contracts").length },
    { value: "invoices", label: "Invoices", count: documents.filter(d => d.category === "invoices").length },
    { value: "photos", label: "Photos", count: documents.filter(d => d.category === "photos").length }
  ];

  const getDocumentIcon = (type) => {
    switch (type) {
      case "pdf": return "FileText";
      case "image": return "Image";
      case "document": return "FileText";
      case "spreadsheet": return "FileSpreadsheet";
      default: return "File";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "quotes": return "info";
      case "drawings": return "success";
      case "contracts": return "warning";
      case "warranties": return "default";
      case "invoices": return "error";
      case "photos": return "info";
      default: return "default";
    }
  };

  const handleDownload = async (document) => {
    try {
      toast.success(`Downloading ${document.name}...`);
      // In a real app, this would trigger actual download
    } catch (err) {
      toast.error("Failed to download document");
    }
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-midnight">
            Document Vault
          </h1>
          <p className="text-gray-600 mt-1">
            Access all your project documents, contracts, and files
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Upload" className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search documents..."
            />
          </div>
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.value
                    ? "bg-terracotta text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.label}
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Empty
          title="No Documents Found"
          description={searchQuery ? "Try adjusting your search terms" : "No documents available in this category"}
          icon="FileText"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-sky-100 rounded-lg">
                  <ApperIcon 
                    name={getDocumentIcon(document.type)} 
                    className="h-6 w-6 text-sky-600" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {document.name}
                    </h3>
                    <Badge variant={getCategoryColor(document.category)}>
                      {document.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {document.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{formatFileSize(document.size)}</span>
                    <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handlePreview(document)}
                      className="flex-1"
                    >
                      <ApperIcon name="Eye" className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(document)}
                    >
                      <ApperIcon name="Download" className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Document Categories Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-display font-semibold text-midnight mb-6">
          Document Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(1).map((category) => (
            <div
              key={category.value}
              className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setSelectedCategory(category.value)}
            >
              <div className="text-2xl font-bold text-midnight mb-1">
                {category.count}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {category.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-semibold">
                  {selectedDocument.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDocument.description}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(selectedDocument)}
                >
                  <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon 
                      name={getDocumentIcon(selectedDocument.type)} 
                      className="h-8 w-8 text-sky-600" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Document Preview
                  </h3>
                  <p className="text-gray-500">
                    Preview for {selectedDocument.name} would load here
                  </p>
                  <div className="mt-4">
                    <Badge variant={getCategoryColor(selectedDocument.category)}>
                      {selectedDocument.category}
                    </Badge>
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

export default Documents;