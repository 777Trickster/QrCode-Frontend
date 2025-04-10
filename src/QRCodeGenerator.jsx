import React, { useState } from 'react';
import axios from 'axios';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text change in the input field
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle QR code generation
  const generateQRCode = async () => {
    if (!text) return;

    setLoading(true);
    try {
      // Make GET request to FastAPI backend
      const response = await axios.get(`https://qrcode-production-9e5c.up.railway.app/generate_qr?text=${encodeURIComponent(text)}`, {
        responseType: 'blob', // to handle binary data
      });

      // Convert the image to a URL object for preview
      const imageUrl = URL.createObjectURL(response.data);
      setQrCode(imageUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
    setLoading(false);
  };

  // Handle download of QR code
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${text}.png`; // Download file with the same name as text input
    link.click();
  };

  return (
    <div className="qr-container">
      <h1>QR Code Generator</h1>
      
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text here"
      />
      
      <button onClick={generateQRCode} disabled={loading}>
        {loading ? "Generating..." : "Generate QR Code"}
      </button>

      {qrCode && (
        <div className="qr-box">
          <img src={qrCode} alt="Generated QR Code" />
        </div>
      )}

      {qrCode && (
        <button onClick={handleDownload}>Download QR Code</button>
      )}
    </div>
  );
};

export default QRCodeGenerator;
