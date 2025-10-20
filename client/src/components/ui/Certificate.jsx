import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const Certificate = ({ certificateData, onClose }) => {
  const certificateRef = useRef();

  const downloadPDF = () => {
    // Using html2canvas and jsPDF for PDF generation
    import('html2canvas').then(html2canvas => {
      import('jspdf').then(({ default: jsPDF }) => {
        const certificate = certificateRef.current;
        
        html2canvas.default(certificate, {
          scale: 2,
          backgroundColor: '#ffffff'
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('landscape', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Certificate-${certificateData.certificateId}.pdf`);
        });
      });
    });
  };

  return (
    <div style={styles.overlay}>
      <motion.div
        style={styles.modal}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button style={styles.closeButton} onClick={onClose}>✕</button>
        
        <div ref={certificateRef} style={styles.certificate}>
          <div style={styles.border}>
            <div style={styles.innerBorder}>
              <div style={styles.content}>
                <div style={styles.logo}>🎓</div>
                <h1 style={styles.title}>Certificate of Completion</h1>
                <div style={styles.divider}></div>
                
                <p style={styles.text}>This is to certify that</p>
                <h2 style={styles.studentName}>{certificateData.studentName}</h2>
                
                <p style={styles.text}>has successfully completed the course</p>
                <h3 style={styles.courseName}>{certificateData.courseName}</h3>
                
                <p style={styles.date}>Completed on {certificateData.completionDate}</p>
                
                <div style={styles.footer}>
                  <div style={styles.signature}>
                    <div style={styles.signatureLine}></div>
                    <p style={styles.signatureText}>Instructor Signature</p>
                  </div>
                  
                  <div style={styles.certificateId}>
                    <p style={styles.idText}>Certificate ID</p>
                    <p style={styles.idNumber}>{certificateData.certificateId}</p>
                  </div>
                  
                  <div style={styles.signature}>
                    <div style={styles.signatureLine}></div>
                    <p style={styles.signatureText}>Director Signature</p>
                  </div>
                </div>
                
                <div style={styles.seal}>
                  <div style={styles.sealInner}>
                    <span style={styles.sealText}>CodeUP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.actions}>
          <button style={styles.downloadButton} onClick={downloadPDF}>
            📥 Download PDF
          </button>
          <button style={styles.shareButton} onClick={() => alert('Share feature coming soon!')}>
            🔗 Share
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#ff4444',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    fontSize: '18px',
    cursor: 'pointer',
    zIndex: 10,
  },
  certificate: {
    backgroundColor: '#ffffff',
    padding: '40px',
    aspectRatio: '1.414',
  },
  border: {
    border: '8px solid #2c3e50',
    padding: '10px',
    height: '100%',
  },
  innerBorder: {
    border: '2px solid #3498db',
    padding: '30px',
    height: '100%',
    position: 'relative',
  },
  content: {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '60px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '36px',
    color: '#2c3e50',
    margin: '10px 0',
    fontFamily: 'Georgia, serif',
    fontWeight: 'bold',
  },
  divider: {
    width: '200px',
    height: '3px',
    background: 'linear-gradient(to right, #3498db, #2ecc71)',
    margin: '20px auto',
  },
  text: {
    fontSize: '16px',
    color: '#555',
    margin: '10px 0',
  },
  studentName: {
    fontSize: '32px',
    color: '#2c3e50',
    margin: '15px 0',
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: '24px',
    color: '#3498db',
    margin: '15px 0',
    fontWeight: 'bold',
  },
  date: {
    fontSize: '14px',
    color: '#777',
    margin: '20px 0',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '40px',
    padding: '0 20px',
  },
  signature: {
    textAlign: 'center',
    flex: 1,
  },
  signatureLine: {
    width: '150px',
    height: '1px',
    backgroundColor: '#333',
    margin: '0 auto 5px',
  },
  signatureText: {
    fontSize: '12px',
    color: '#555',
    margin: 0,
  },
  certificateId: {
    textAlign: 'center',
    flex: 1,
  },
  idText: {
    fontSize: '10px',
    color: '#777',
    margin: '0 0 5px 0',
  },
  idNumber: {
    fontSize: '12px',
    color: '#333',
    fontWeight: 'bold',
    margin: 0,
  },
  seal: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid #e74c3c',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sealInner: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: '2px solid #e74c3c',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealText: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#e74c3c',
    transform: 'rotate(-15deg)',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '20px',
  },
  downloadButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  shareButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Certificate;
