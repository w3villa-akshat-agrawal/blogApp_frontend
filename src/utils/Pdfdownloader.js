import { jsPDF } from "jspdf";

const pdfDownloader = async (data) => {
  const { name, email, phone } = data;

  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Profile Information", 20, 20);

  // Profile details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Name: ${name}`, 20, 40);
  doc.text(`Email: ${email}`, 20, 55);
  doc.text(`Phone: ${phone}`, 20, 70);

  // Save file
  doc.save("profile-info.pdf");
};

export default pdfDownloader;
