import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './Supply.scss';

const Supply = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const suppliesPerPage = 10;

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await axios.get('https://eurodoor-backend.onrender.com/api/reports/suppliers');
        setSupplies(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSupplies();
  }, []);

  const downloadPDF = async () => {
    try {
      const response = await axios.get(
        'https://eurodoor-backend.onrender.com/api/reports/download/suppliers',
        { responseType: 'blob' }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(pdfBlob, 'supplier_report.pdf');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download supplier report');
    }
  };

  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = 
      supply.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.unit?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPayment = filterPayment === 'all' || supply.paymentStatus === filterPayment;
    const matchesStatus = filterStatus === 'all' || supply.status === filterStatus;
    
    return matchesSearch && matchesPayment && matchesStatus;
  });

  // Pagination logic
  const indexOfLastSupply = currentPage * suppliesPerPage;
  const indexOfFirstSupply = indexOfLastSupply - suppliesPerPage;
  const currentSupplies = filteredSupplies.slice(indexOfFirstSupply, indexOfLastSupply);
  const totalPages = Math.ceil(filteredSupplies.length / suppliesPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading supplier data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="supply-report">
      <div className="report-header">
        <h1>Supplier Report</h1>
        <button onClick={downloadPDF} className="download-btn">
          Download PDF
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search suppliers or materials..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="filter-group">
          <label>Payment Status:</label>
          <select
            value={filterPayment}
            onChange={(e) => {
              setFilterPayment(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Supply Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="supplied">Supplied</option>
            <option value="accepted">Accepted</option>
            <option value="rejected-by-inventory">Rejected by Inventory</option>
          </select>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Requests</h3>
          <p>{filteredSupplies.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Cost</h3>
          <p>{formatCurrency(filteredSupplies.reduce((sum, item) => sum + (item.totalCost || 0), 0))}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Payment</h3>
          <p>{formatCurrency(filteredSupplies
            .filter(item => item.paymentStatus === 'unpaid')
            .reduce((sum, item) => sum + (item.totalCost || 0), 0))}
          </p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Material</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Total Cost</th>
              <th>Payment</th>
              <th>Supply Status</th>
            </tr>
          </thead>
          <tbody>
            {currentSupplies.length > 0 ? (
              currentSupplies.map((supply, index) => (
                <tr key={`${supply._id || index}`}>
                  <td>{supply.supplier}</td>
                  <td>{supply.materialName}</td>
                  <td>{supply.unit}</td>
                  <td>{supply.quantity}</td>
                  <td>{formatCurrency(supply.unitCost)}</td>
                  <td>{formatCurrency(supply.totalCost)}</td>
                  <td>
                    <span className={`payment-status ${supply.paymentStatus}`}>
                      {supply.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`supply-status ${supply.status.replace(/_/g, '-')}`}>
                      {supply.status.replace(/-/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-orders">
                  No supplier requests found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredSupplies.length > suppliesPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Supply;