import { useState } from "react";
import { PageHead, Card, Stat, Chip, Btn } from "../../components/common/Primitives";
import "./AdminPlacementsPage.css";

const FILTERS = ["All", "pending", "approved", "rejected"];
const KIND = { approved: "ok", pending: "warn", rejected: "err" };

const PLACEMENTS = [
  { id: 1, student: "Alice Namukasa", company: "Airtel Uganda",     supervisor: "Mr. Okello",  status: "approved" },
  { id: 2, student: "Brian Ssemanda", company: "MTN Uganda",        supervisor: "Ms. Akello",  status: "pending"  },
  { id: 3, student: "Carol Atim",     company: "Stanbic Bank",      supervisor: "Mr. Mugisha", status: "approved" },
  { id: 4, student: "David Kato",     company: "Makerere E-Health", supervisor: "—",           status: "pending"  },
  { id: 5, student: "Eva Nambi",      company: "NITA-U",            supervisor: "Ms. Nanteza", status: "rejected" },
];

export default function AdminPlacementsPage() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? PLACEMENTS : PLACEMENTS.filter((p) => p.status === filter);

  const counts = {
    total:    PLACEMENTS.length,
    pending:  PLACEMENTS.filter((p) => p.status === "pending").length,
    approved: PLACEMENTS.filter((p) => p.status === "approved").length,
    rejected: PLACEMENTS.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="page">
      <PageHead
        title="Placements"
        sub="Manage and approve student internship placements."
      />

      <div className="grid grid--4">
        <Stat label="Total"    value={counts.total}    />
        <Stat label="Pending"  value={counts.pending}  />
        <Stat label="Approved" value={counts.approved} />
        <Stat label="Rejected" value={counts.rejected} />
      </div>

      <Card label="All Placements">
        <div className="ap-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`ap-filter${filter === f ? " ap-filter--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <table className="ap-table">
          <thead>
            <tr>
              <th scope="col">Student</th>
              <th scope="col">Company</th>
              <th scope="col">Supervisor</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="ap-empty">No placements match this filter.</td>
              </tr>
            ) : (
              visible.map((p) => (
                <tr key={p.id}>
                  <td>{p.student}</td>
                  <td>{p.company}</td>
                  <td>{p.supervisor}</td>
                  <td><Chip kind={KIND[p.status]}>{p.status}</Chip></td>
                  <td>
                    {p.status === "pending" && (
                      <div className="ap-actions">
                        <Btn kind="primary" sm>Approve</Btn>
                        <Btn kind="danger" sm>Reject</Btn>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
