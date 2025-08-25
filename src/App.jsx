import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Tickets from "@/components/pages/Tickets";
import Brief from "@/components/pages/Brief";
import Proposals from "@/components/pages/Proposals";
import Calendar from "@/components/pages/Calendar";
import Timeline from "@/components/pages/Timeline";
import Dashboard from "@/components/pages/Dashboard";
import Documents from "@/components/pages/Documents";
import Messages from "@/components/pages/Messages";
import Payments from "@/components/pages/Payments";
import Layout from "@/components/organisms/Layout";

function App() {
return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="brief" element={<Brief />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="documents" element={<Documents />} />
            <Route path="messages" element={<Messages />} />
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