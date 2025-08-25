import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Brief from "@/components/pages/Brief";
import Proposals from "@/components/pages/Proposals";
import Timeline from "@/components/pages/Timeline";
import Messages from "@/components/pages/Messages";
import Documents from "@/components/pages/Documents";
import Payments from "@/components/pages/Payments";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="brief" element={<Brief />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="messages" element={<Messages />} />
            <Route path="documents" element={<Documents />} />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;