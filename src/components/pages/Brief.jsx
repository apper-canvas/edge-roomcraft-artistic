import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";
import { briefService } from "@/services/api/briefService";

const Brief = () => {
  const [brief, setBrief] = useState({
    rooms: [],
    styleQuizAnswers: {},
    requirements: "",
    budget: ""
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const briefData = await briefService.getAll();
      if (briefData.length > 0) {
        setBrief(briefData[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to load brief data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const styleQuestions = [
    {
      id: "style",
      question: "What's your preferred design style?",
      options: [
        { value: "modern", label: "Modern", image: "🏢" },
        { value: "traditional", label: "Traditional", image: "🏛️" },
        { value: "scandinavian", label: "Scandinavian", image: "🌲" },
        { value: "industrial", label: "Industrial", image: "⚙️" },
        { value: "bohemian", label: "Bohemian", image: "🌺" },
        { value: "minimalist", label: "Minimalist", image: "⬜" }
      ]
    },
    {
      id: "colors",
      question: "Which color palette appeals to you?",
      options: [
        { value: "neutral", label: "Neutral Tones", image: "🤎" },
        { value: "bold", label: "Bold Colors", image: "🔴" },
        { value: "pastels", label: "Soft Pastels", image: "🌸" },
        { value: "monochrome", label: "Black & White", image: "⚫" },
        { value: "earth", label: "Earth Tones", image: "🌍" },
        { value: "jewel", label: "Jewel Tones", image: "💎" }
      ]
    },
    {
      id: "lighting",
      question: "What lighting do you prefer?",
      options: [
        { value: "natural", label: "Natural Light", image: "☀️" },
        { value: "warm", label: "Warm & Cozy", image: "🕯️" },
        { value: "bright", label: "Bright & Energetic", image: "💡" },
        { value: "ambient", label: "Ambient Mood", image: "🌙" }
      ]
    },
    {
      id: "furniture",
      question: "What furniture style do you like?",
      options: [
        { value: "contemporary", label: "Contemporary", image: "🪑" },
        { value: "vintage", label: "Vintage", image: "🛋️" },
        { value: "custom", label: "Custom Built", image: "🔨" },
        { value: "mixed", label: "Mixed Styles", image: "🎭" }
      ]
    }
  ];

  const handleQuizAnswer = (questionId, value) => {
    setBrief(prev => ({
      ...prev,
      styleQuizAnswers: {
        ...prev.styleQuizAnswers,
        [questionId]: value
      }
    }));
  };

  const handleFileUpload = (files) => {
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
      file
    }));
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    toast.success(`${files.length} photos uploaded successfully`);
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== photoId));
    toast.success("Photo removed");
  };

  const handleSubmit = async () => {
    try {
      await briefService.create({
        ...brief,
        photos: uploadedPhotos
      });
      toast.success("Brief submitted successfully!");
      setCurrentStep(4);
    } catch (err) {
      toast.error("Failed to submit brief");
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-display font-bold text-midnight">
            Project Brief & Style Quiz
          </h1>
          <div className="text-sm text-gray-600">
            Step {currentStep} of 4
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1">
              <div className={`h-2 rounded-full ${
                step <= currentStep ? "bg-gradient-to-r from-terracotta to-orange-500" : "bg-gray-200"
              }`} />
              <div className="mt-2 text-xs text-center text-gray-600">
                {step === 1 && "Requirements"}
                {step === 2 && "Style Quiz"}
                {step === 3 && "Photos"}
                {step === 4 && "Review"}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Step 1: Requirements */}
      {currentStep === 1 && (
        <Card className="p-8">
          <h2 className="text-xl font-display font-semibold text-midnight mb-6">
            Tell us about your project
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Project Budget" required>
                <Select
                  value={brief.budget}
                  onChange={(e) => setBrief(prev => ({ ...prev, budget: e.target.value }))}
                >
                  <option value="">Select budget range</option>
                  <option value="10000-25000">$10,000 - $25,000</option>
                  <option value="25000-50000">$25,000 - $50,000</option>
                  <option value="50000-100000">$50,000 - $100,000</option>
                  <option value="100000+">$100,000+</option>
                </Select>
              </FormField>
              
              <FormField label="Project Timeline">
                <Select>
                  <option value="">Select timeline</option>
                  <option value="1-3">1-3 months</option>
                  <option value="3-6">3-6 months</option>
                  <option value="6-12">6-12 months</option>
                  <option value="12+">12+ months</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Rooms to be designed" required>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Living Room", "Kitchen", "Bedroom", "Bathroom", "Dining Room", "Office"].map((room) => (
                  <label key={room} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-sky rounded border-gray-300 focus:ring-sky focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{room}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Specific Requirements">
              <Textarea
                placeholder="Tell us about your specific needs, preferences, or challenges..."
                value={brief.requirements}
                onChange={(e) => setBrief(prev => ({ ...prev, requirements: e.target.value }))}
                className="h-32"
              />
            </FormField>
          </div>

          <div className="flex justify-end mt-8">
            <Button onClick={nextStep}>
              Next Step
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Style Quiz */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {styleQuestions.map((question, questionIndex) => (
            <Card key={question.id} className="p-8">
              <h2 className="text-xl font-display font-semibold text-midnight mb-6">
                {question.question}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleQuizAnswer(question.id, option.value)}
                    className={`p-6 border-2 rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                      brief.styleQuizAnswers[question.id] === option.value
                        ? "border-terracotta bg-orange-50 shadow-lg"
                        : "border-gray-200 hover:border-sky"
                    }`}
                  >
                    <div className="text-4xl mb-3">{option.image}</div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                  </button>
                ))}
              </div>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextStep}>
              Next Step
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Photo Upload */}
      {currentStep === 3 && (
        <Card className="p-8">
          <h2 className="text-xl font-display font-semibold text-midnight mb-6">
            Upload Room Photos
          </h2>
          
          <div className="space-y-6">
            <FileUpload onFileSelect={handleFileUpload} />
            
            {uploadedPhotos.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Uploaded Photos ({uploadedPhotos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ApperIcon name="X" className="h-3 w-3" />
                      </button>
                      <div className="mt-2 text-xs text-gray-600 truncate">
                        {photo.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep}>
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextStep}>
              Next Step
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <Card className="p-8">
          <h2 className="text-xl font-display font-semibold text-midnight mb-6">
            Review Your Brief
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-3">Style Preferences</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(brief.styleQuizAnswers).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="ml-2 font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {brief.requirements && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-3">Requirements</h3>
                <p className="text-sm text-gray-700">{brief.requirements}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-3">
                Photos ({uploadedPhotos.length})
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {uploadedPhotos.slice(0, 8).map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-16 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep}>
              <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleSubmit}>
              Submit Brief
              <ApperIcon name="Send" className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Brief;