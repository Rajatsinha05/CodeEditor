import React, { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";

import TemplateSelector from "./TemplateSelector";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";

const ResumeUi = ({ student }) => {
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [scale, setScale] = useState(1);
  const resumeRef = useRef(null);

  useEffect(() => {
    setScale(1);
  }, [activeTemplate]);

  const downloadPDF = () => {
    // const originalElement = resumeRef.current;
    // if (!originalElement) return;
    // // Clone the element to avoid affecting live DOM
    // const element = originalElement.cloneNode(true);
    // document.body.appendChild(element);
    // // Force override all colors and remove problematic elements
    // const forcePDFStyles = (el) => {
    //   el.style.color = "#000000 !important";
    //   el.style.backgroundColor = "#ffffff !important";
    //   el.style.borderColor = "#cccccc !important";
    //   // Remove elements marked for PDF ignore
    //   if (el.dataset.pdfIgnore === "true") {
    //     el.parentNode?.removeChild(el);
    //   }
    // };
    // // Apply to all elements including nested components
    // element.querySelectorAll("*").forEach(forcePDFStyles);
    // // Additional safety for root element
    // element.style.backgroundColor = "#ffffff";
    // element.style.color = "#000000";
    // const opt = {
    //   margin: 0,
    //   filename: `${student.name.toLowerCase().replace(/\s+/g, "-")}-resume.pdf`,
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: {
    //     scale: 3,
    //     useCORS: true,
    //     backgroundColor: "#ffffff",
    //     logging: false,
    //     ignoreElements: (el) => el.dataset.pdfIgnore === "true",
    //   },
    //   jsPDF: {
    //     unit: "mm",
    //     format: "a4",
    //     orientation: "portrait",
    //     compress: true,
    //   },
    // };
    // html2pdf()
    //   .set(opt)
    //   .from(element)
    //   .save()
    //   .finally(() => {
    //     document.body.removeChild(element); // Clean up cloned element
    //   });
  };

  const templates = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
    professional: ProfessionalTemplate,
    elegant: ElegantTemplate,
  };

  const SelectedTemplate = templates[activeTemplate];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 sticky top-0 bg-gray-100 py-4 z-50">
          <TemplateSelector
            activeTemplate={activeTemplate}
            setActiveTemplate={setActiveTemplate}
            scale={scale}
            setScale={setScale}
          />
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Download size={20} /> Download PDF
          </button>
        </div>

        <div className="flex justify-center">
          <div
            ref={resumeRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: "210mm",
              minHeight: "297mm",
              transition: "transform 0.2s ease",
              backgroundColor: "white",
              color: "black",
              padding: "20mm",
            }}
            className="shadow-lg pdf-root"
          >
            <SelectedTemplate student={student} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUi;
