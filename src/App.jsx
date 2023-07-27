import React, { useRef } from 'react';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Users from './Collections/Users'; 


const styles = {
  receiptBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    boxShadow: '2px 2px 5px #888888',
  },
  actualReceipt: {
    padding: 10,
    flexGrow: 1,
  },
 
};

const App = () => {
  const [loader, setLoader] = useState(false);
  const refs = useRef(Users.map(() => ({ front: React.createRef(), back: React.createRef() })));

  const downloadPDF = () => {
    setLoader(true);
    const doc = new jsPDF('p', 'mm', 'a4');

    Users.forEach((user, index) => {
      const { front, back } = refs.current[index];

      html2canvas(front.current).then((canvas) => {
        const imgDataFront = canvas.toDataURL('image/jpeg');

        html2canvas(back.current).then((canvas) => {
          const imgDataBack = canvas.toDataURL('image/jpeg');

          if (index > 0) {
            doc.addPage(); // Add a new page for the front side of subsequent users
          }
          doc.addImage(imgDataFront, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

          doc.addPage(); // Add a new page for the back side
          doc.addImage(imgDataBack, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

          if (index === Users.length - 1) {
            setLoader(false);
            doc.save('receipt.pdf');
          }
        });
      });
    });
  };

  return (
    <div className="wrapper">
      {Users.map((user, index) => (
        <div className="receipt-box" key={user.id}>
          {/* Front side */}
          <div ref={refs.current[index].front} style={styles.actualReceipt}>
            <h1>{user.firstName}</h1> 
          </div>

          {/* Back side */}
          <div ref={refs.current[index].back} style={styles.actualReceipt}>
            <h1>{user.surname}</h1>
           
          </div>
        </div>
      ))}

      {/* Receipt action */}
      <div className="receipt-actions-div">
        <div style={styles.actionsRight}>
          <button
            className="receipt-modal-download-button"
            onClick={downloadPDF}
            disabled={loader}
          >
            {loader ? 'Downloading' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;