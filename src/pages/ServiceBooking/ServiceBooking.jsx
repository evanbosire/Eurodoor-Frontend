import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './ServiceBooking.scss';

const ServiceBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://eurodoor-backend.onrender.com/api/reports/service-bookings');
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const downloadPDF = async () => {
    try {
      const response = await axios.get(
        'https://eurodoor-backend.onrender.com/api/reports/download/service-bookings',
        { responseType: 'blob' }
      );
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(pdfBlob, 'service_bookings_report.pdf');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download service bookings report');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.includes(searchTerm) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.paymentCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment;
    const matchesStatus = filterStatus === 'all' || booking.serviceStatus === filterStatus;
    
    return matchesSearch && matchesPayment && matchesStatus;
  });

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading service bookings...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="service-bookings-report">
      <div className="report-header">
        <h1>Service Bookings Report</h1>
        <button onClick={downloadPDF} className="download-btn">
          Download PDF
        </button>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by customer, service, phone, email or code..."
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
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Service Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="requested">Requested</option>
            <option value="payment_confirmed">Payment Confirmed</option>
            <option value="allocated_to_supervisor">Allocated to Supervisor</option>
            <option value="technician_assigned">Technician Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="rendered">Rendered</option>
            <option value="supervisor_approved">Supervisor Approved</option>
            <option value="service_manager_confirmed">Service Manager Confirmed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Bookings</h3>
          <p>{filteredBookings.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>{formatCurrency(filteredBookings.reduce((sum, booking) => sum + (booking.price || 0), 0))}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Payment</h3>
          <p>{formatCurrency(filteredBookings
            .filter(booking => booking.paymentStatus === 'pending')
            .reduce((sum, booking) => sum + (booking.price || 0), 0))}
          </p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Service</th>
              <th>Price</th>
              <th>Payment Code</th>
              <th>Payment Status</th>
              <th>Service Status</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length > 0 ? (
              currentBookings.map((booking, index) => (
                <tr key={`${booking._id || index}`}>
                  <td>{booking.customerName}</td>
                  <td>
                    <div className="contact-info">
                      <div>{booking.phone}</div>
                      <div>{booking.email}</div>
                    </div>
                  </td>
                  <td>{booking.service}</td>
                  <td>{formatCurrency(booking.price)}</td>
                  <td className="payment-code">{booking.paymentCode || 'N/A'}</td>
                  <td>
                    <span className={`payment-status ${booking.paymentStatus}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="service-status-cell">
                    <span className={`service-status ${booking.serviceStatus.replace(/_/g, '-')}`}>
                      {booking.serviceStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{formatDate(booking.bookingDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-bookings">
                  No service bookings found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredBookings.length > bookingsPerPage && (
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

export default ServiceBookings;