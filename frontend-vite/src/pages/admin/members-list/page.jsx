import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import LoadOverlay from "../../../components/LoadOverlay";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EditableRow from "./EditableRow";
import ReadOnlyRow from "./ReadOnlyRow";
import { ChevronUp, ChevronDown } from "lucide-react";
import MemberProfileModal from "./MemberProfileModal";

export default function MembersList() {
  const { getToken } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Fetching members...");
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editData, setEditData] = useState({});
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const rowsPerPage = 6;
  const statuses = ["active", "closed"];

  // ---------- Sorting ----------
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getValue = (obj, key) =>
    obj[key] ? obj[key].toString().toLowerCase() : "";

  const sortedMembers = [...members].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = getValue(a, sortConfig.key);
    const bVal = getValue(b, sortConfig.key);
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (key) =>
    sortConfig.key !== key ? (
      <ChevronDown size={14} className="inline-block ml-1 opacity-40" />
    ) : sortConfig.direction === "asc" ? (
      <ChevronUp size={16} className="inline-block ml-1 text-yellow-300" />
    ) : (
      <ChevronDown size={16} className="inline-block ml-1 text-yellow-300" />
    );

  // ---------- Search ----------
  const filteredMembers = sortedMembers.filter((m) => {
    const term = search.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(term) ||
      (m.email || "").toLowerCase().includes(term) ||
      (m.phone || "").toLowerCase().includes(term) ||
      (m.guardian || "").toLowerCase().includes(term) ||
      (m.designation || "").toLowerCase().includes(term) ||
      (m.memberType || "").toLowerCase().includes(term) ||
      (m.societyNumber || "").toLowerCase().includes(term) ||
      (m.status || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredMembers, totalPages]);

  // ---------- Fetch ----------
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers(res.data);
    } catch {
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, []);

  // ---------- Excel ----------
  const handleDownloadExcel = () => {
    if (!filteredMembers.length) {
      toast.info("No data to export");
      return;
    }

    const exportData = filteredMembers.map((m, i) => ({
  "Sl No": i + 1,
  Name: m.name,
  Email: m.email,
  Phone: m.phone,
  Guardian: m.guardian,
  DOB: m.dob ? new Date(m.dob).toLocaleDateString("en-GB") : "-",
  "Joining Date": m.joiningDate
    ? new Date(m.joiningDate).toLocaleDateString("en-GB")
    : "-",
  "Society No": m.societyNumber,
  Role: m.role,
  Status: m.status,
}));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer]),
      `Members_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // ---------- Delete ----------
  const handleDelete = async (id) => {
    if (!confirm("Delete this member?")) return;
    try {
      setLoading(true);
      const token = await getToken();
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/members/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembers((p) => p.filter((m) => m._id !== id));
      toast.success("Member deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Edit ----------
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.[0]) {
      setEditData((p) => ({ ...p, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setEditData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleUpdate = async (id) => {
    try {
      setLoading(true);
      const token = await getToken();
      const fd = new FormData();
      Object.entries(editData).forEach(([k, v]) => v && fd.append(k, v));

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/members/${id}`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Member updated");
      setEditingMemberId(null);
      setEditData({});
      setPreview(null);
      fetchMembers();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-violet-50 p-6">
      <LoadOverlay show={loading} message={loadingMessage} />

      <h2 className="text-3xl font-bold text-center mb-6">👥 Members List</h2>

      <div className="flex justify-between mb-4 gap-3">
        <input
          className="border px-4 py-2 rounded w-1/3"
          placeholder="Search members..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={handleDownloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th>Sl</th>
              <th>Photo</th>
              {[
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["guardian", "Guardian"],
  ["dob", "Dob"],              // ✅ FIXED
  ["joiningDate", "Joining Date"],
  ["societyNumber", "Society No"],
  ["role", "Role"],
  ["status", "Status"],
]
.map(([k, l]) => (
  <th key={k} onClick={() => handleSort(k)}>
    {l} {renderSortIcon(k)}
  </th>
))}

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedMembers.map((m, i) => (
              <tr key={m._id} className="border-b hover:bg-indigo-50">
                <td>{(currentPage - 1) * rowsPerPage + i + 1}</td>
                {editingMemberId === m._id ? (
                  <EditableRow
                    member={m}
                    editData={editData}
                    handleEditChange={handleEditChange}
                    handleUpdate={handleUpdate}
                    setEditingMemberId={setEditingMemberId}
                    setPreview={setPreview}
                    statuses={statuses}
                    preview={preview}
                  />
                ) : (
                  <ReadOnlyRow
                    member={m}
                    setEditingMemberId={setEditingMemberId}
                    setEditData={setEditData}
                    handleDelete={handleDelete}
                    setSelectedMemberId={setSelectedMemberId}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMemberId && (
        <MemberProfileModal
          memberId={selectedMemberId}
          onClose={() => setSelectedMemberId(null)}
        />
      )}
    </div>
  );
}
