import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Eye, Printer, ReceiptText, School, UserRound } from 'lucide-react';
import './styles.css';

const school = {
  name: 'North Valley Preparatory School',
  address: '1200 Cedar Ridge Road',
  cityStateZip: 'Boulder, CO 80302',
  phone: '(303) 555-0184',
  email: 'billing@northvalleyprep.edu',
};

const student = {
  name: 'Maya Thompson',
  id: 'STU-10427',
  grade: '10',
  guardian: 'Jordan Thompson',
  billingAddress: '884 Willow Street, Boulder, CO 80304',
};

const charges = [
  { id: 'tuition', label: 'Spring Semester Tuition', date: 'Jan 8, 2026', amount: 4200 },
  { id: 'lab', label: 'Science Lab Fee', date: 'Jan 12, 2026', amount: 185 },
  { id: 'athletics', label: 'Athletics Program Fee', date: 'Feb 1, 2026', amount: 250 },
  { id: 'materials', label: 'Course Materials', date: 'Feb 15, 2026', amount: 96 },
  { id: 'trip', label: 'History Museum Field Trip', date: 'Mar 3, 2026', amount: 42 },
];

const payments = [
  { id: 'deposit', label: 'Enrollment Deposit', date: 'Jan 3, 2026', amount: 750 },
  { id: 'card', label: 'Card Payment', date: 'Feb 20, 2026', amount: 1200 },
];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function displayDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function money(value) {
  return currency.format(value);
}

function App() {
  const [selectedCharges, setSelectedCharges] = useState(() =>
    Object.fromEntries(charges.map((charge) => [charge.id, true])),
  );
  const [showPayments, setShowPayments] = useState(true);
  const [issueDate, setIssueDate] = useState('2026-05-14');
  const [dueDate, setDueDate] = useState('2026-05-31');
  const [billToName, setBillToName] = useState(student.guardian);
  const [billToAddress, setBillToAddress] = useState(student.billingAddress);

  const visibleCharges = useMemo(
    () => charges.filter((charge) => selectedCharges[charge.id]),
    [selectedCharges],
  );

  const chargeTotal = visibleCharges.reduce((total, charge) => total + charge.amount, 0);
  const paymentTotal = showPayments
    ? payments.reduce((total, payment) => total + payment.amount, 0)
    : 0;
  const balanceDue = chargeTotal - paymentTotal;

  function toggleCharge(id) {
    setSelectedCharges((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <main className="app-shell">
      <section className="screen-toolbar no-print" aria-label="Invoice print controls">
        <div>
          <p className="eyebrow">Print Preview</p>
          <h1>Student Invoice</h1>
        </div>
        <button className="print-button" type="button" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" />
          Print
        </button>
      </section>

      <div className="workspace">
        <aside className="control-panel no-print" aria-label="Invoice display options">
          <div className="panel-heading">
            <ReceiptText size={20} aria-hidden="true" />
            <h2>Invoice Items</h2>
          </div>

          <fieldset>
            <legend>Charges to include</legend>
            <div className="check-list">
              {charges.map((charge) => (
                <label className="check-row" key={charge.id}>
                  <input
                    type="checkbox"
                    checked={selectedCharges[charge.id]}
                    onChange={() => toggleCharge(charge.id)}
                  />
                  <span>
                    <strong>{charge.label}</strong>
                    <small>{money(charge.amount)}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="check-row payments-toggle">
            <input
              type="checkbox"
              checked={showPayments}
              onChange={() => setShowPayments((current) => !current)}
            />
            <span>
              <strong>Show payments on printed invoice</strong>
              <small>{showPayments ? 'Payments will be included' : 'Payments hidden'}</small>
            </span>
          </label>

          <fieldset className="date-controls">
            <legend>Invoice dates</legend>
            <label className="date-field">
              <span>Issue date</span>
              <input
                type="date"
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
              />
            </label>
            <label className="date-field">
              <span>Due date</span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </label>
          </fieldset>

          <fieldset className="bill-to-controls">
            <legend>Bill to</legend>
            <label className="text-field">
              <span>Name</span>
              <input
                type="text"
                value={billToName}
                onChange={(event) => setBillToName(event.target.value)}
              />
            </label>
            <label className="text-field">
              <span>Address</span>
              <textarea
                rows="3"
                value={billToAddress}
                onChange={(event) => setBillToAddress(event.target.value)}
              />
            </label>
          </fieldset>

          <div className="preview-card" aria-label="Current print preview summary">
            <div className="preview-card-heading">
              <Eye size={18} aria-hidden="true" />
              <strong>Preview</strong>
            </div>
            <dl>
              <div>
                <dt>Issued</dt>
                <dd>{displayDate(issueDate)}</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>{displayDate(dueDate)}</dd>
              </div>
              <div>
                <dt>Charges</dt>
                <dd>{visibleCharges.length} of {charges.length}</dd>
              </div>
              <div>
                <dt>Payments</dt>
                <dd>{showPayments ? 'Shown' : 'Hidden'}</dd>
              </div>
              <div>
                <dt>Balance</dt>
                <dd>{money(balanceDue)}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <section className="preview-stage" aria-label="Printed invoice preview">
          <div className="preview-ruler no-print">
            <span>Printed invoice preview</span>
            <span>Letter page</span>
          </div>

          <article className="invoice-page" aria-label="Invoice preview">
          <header className="invoice-header">
            <div className="brand-block">
              <div className="brand-mark">
                <School size={26} aria-hidden="true" />
              </div>
              <div>
                <h2>{school.name}</h2>
                <p>{school.address}</p>
                <p>{school.cityStateZip}</p>
                <p>{school.phone} · {school.email}</p>
              </div>
            </div>
            <div className="invoice-meta">
              <p>Invoice</p>
              <strong>INV-2026-0318</strong>
              <span>Issued {displayDate(issueDate)}</span>
              <span>Due {displayDate(dueDate)}</span>
            </div>
          </header>

          <section className="info-grid" aria-label="Student and billing information">
            <div>
              <div className="section-title">
                <UserRound size={17} aria-hidden="true" />
                <h3>Student</h3>
              </div>
              <p className="primary-line">{student.name}</p>
              <p>ID {student.id}</p>
              <p>Grade {student.grade}</p>
            </div>
            <div>
              <h3>Bill To</h3>
              <p className="primary-line">{billToName || 'Billing name'}</p>
              <p className="preserve-lines">{billToAddress || 'Billing address'}</p>
            </div>
          </section>

          <section className="invoice-section">
            <div className="section-heading">
              <h3>Charges</h3>
              <span>{visibleCharges.length} selected</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Description</th>
                    <th scope="col" className="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCharges.map((charge) => (
                    <tr key={charge.id}>
                      <td>{charge.date}</td>
                      <td>{charge.label}</td>
                      <td className="amount">{money(charge.amount)}</td>
                    </tr>
                  ))}
                  {visibleCharges.length === 0 && (
                    <tr>
                      <td colSpan="3" className="empty-row">No charges selected.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {showPayments && (
            <section className="invoice-section payments-section">
              <div className="section-heading">
                <h3>Payments</h3>
                <span>Applied to balance</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Description</th>
                      <th scope="col" className="amount">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.date}</td>
                        <td>{payment.label}</td>
                        <td className="amount">-{money(payment.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="totals" aria-label="Invoice totals">
            <div>
              <span>Selected Charges</span>
              <strong>{money(chargeTotal)}</strong>
            </div>
            {showPayments && (
              <div>
                <span>Payments</span>
                <strong>-{money(paymentTotal)}</strong>
              </div>
            )}
            <div className="balance">
              <span>Balance Due</span>
              <strong>{money(balanceDue)}</strong>
            </div>
          </section>

          <footer className="invoice-footer">
            <p>Please make checks payable to {school.name}. Thank you.</p>
          </footer>
          </article>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
