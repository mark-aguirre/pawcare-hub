import { LabTest } from '@/types';

export function exportLabTestsToCSV(labTests: LabTest[], filename?: string) {
  const headers = [
    'Test ID',
    'Pet Name',
    'Pet ID',
    'Test Type',
    'Status',
    'Requested Date',
    'Completed Date',
    'Veterinarian',
    'Notes',
    'Results'
  ];

  const csvContent = [
    headers.join(','),
    ...labTests.map(test => [
      test.id,
      `"${test.petName}"`,
      test.petId,
      `"${test.testType}"`,
      test.status,
      test.requestedDate.toISOString().split('T')[0],
      test.completedDate ? test.completedDate.toISOString().split('T')[0] : '',
      `"${test.veterinarianName}"`,
      `"${test.notes || ''}"`,
      `"${test.results ? test.results.replace(/"/g, '""') : ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `lab-tests-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function printLabTestReport(test: LabTest) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab Test Report - ${test.testType}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .clinic-name {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .report-title {
          font-size: 20px;
          margin-top: 10px;
          color: #666;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-weight: bold;
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
        }
        .info-value {
          font-size: 14px;
          margin-top: 2px;
        }
        .results-section {
          margin-top: 30px;
        }
        .results-content {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
          white-space: pre-wrap;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-completed {
          background-color: #d4edda;
          color: #155724;
        }
        .status-in-progress {
          background-color: #d1ecf1;
          color: #0c5460;
        }
        .status-requested {
          background-color: #fff3cd;
          color: #856404;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="clinic-name">PawCare Veterinary Clinic</div>
        <div class="report-title">Laboratory Test Report</div>
      </div>

      <div class="info-section">
        <div class="info-title">Test Information</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Test ID</span>
            <span class="info-value">${test.id}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Test Type</span>
            <span class="info-value">${test.testType}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value">
              <span class="status-badge status-${test.status}">${test.status}</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Requested Date</span>
            <span class="info-value">${formatDate(test.requestedDate)}</span>
          </div>
          ${test.completedDate ? `
          <div class="info-item">
            <span class="info-label">Completed Date</span>
            <span class="info-value">${formatDate(test.completedDate)}</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="info-section">
        <div class="info-title">Patient Information</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Pet Name</span>
            <span class="info-value">${test.petName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Pet ID</span>
            <span class="info-value">${test.petId}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-title">Veterinarian Information</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Veterinarian</span>
            <span class="info-value">${test.veterinarianName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Veterinarian ID</span>
            <span class="info-value">${test.veterinarianId}</span>
          </div>
        </div>
      </div>

      ${test.notes ? `
      <div class="info-section">
        <div class="info-title">Notes</div>
        <div class="info-value">${test.notes}</div>
      </div>
      ` : ''}

      ${test.results ? `
      <div class="results-section">
        <div class="info-title">Test Results</div>
        <div class="results-content">${test.results}</div>
      </div>
      ` : ''}

      <div class="footer">
        <p>Generated on ${formatDate(new Date())}</p>
        <p>PawCare Veterinary Clinic - Professional Pet Care Services</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

export function printLabTestSummary(labTests: LabTest[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const stats = {
    total: labTests.length,
    requested: labTests.filter(t => t.status === 'requested').length,
    inProgress: labTests.filter(t => t.status === 'in-progress').length,
    completed: labTests.filter(t => t.status === 'completed').length,
    cancelled: labTests.filter(t => t.status === 'cancelled').length
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab Tests Summary Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .clinic-name {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .report-title {
          font-size: 20px;
          margin-top: 10px;
          color: #666;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .stat-card {
          text-align: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .status-badge {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-completed { background-color: #d4edda; color: #155724; }
        .status-in-progress { background-color: #d1ecf1; color: #0c5460; }
        .status-requested { background-color: #fff3cd; color: #856404; }
        .status-cancelled { background-color: #f8d7da; color: #721c24; }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="clinic-name">PawCare Veterinary Clinic</div>
        <div class="report-title">Laboratory Tests Summary Report</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${stats.total}</div>
          <div class="stat-label">Total Tests</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.requested}</div>
          <div class="stat-label">Requested</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.inProgress}</div>
          <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.completed}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.cancelled}</div>
          <div class="stat-label">Cancelled</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Pet Name</th>
            <th>Test Type</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Completed</th>
            <th>Veterinarian</th>
          </tr>
        </thead>
        <tbody>
          ${labTests.map(test => `
            <tr>
              <td>${test.id}</td>
              <td>${test.petName}</td>
              <td>${test.testType}</td>
              <td><span class="status-badge status-${test.status}">${test.status}</span></td>
              <td>${formatDate(test.requestedDate)}</td>
              <td>${test.completedDate ? formatDate(test.completedDate) : '-'}</td>
              <td>${test.veterinarianName}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Generated on ${formatDate(new Date())}</p>
        <p>PawCare Veterinary Clinic - Professional Pet Care Services</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}