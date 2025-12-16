"use client";

import { Save, X } from "lucide-react";

export default function EditableRow({
  member,
  editData,
  handleEditChange,
  handleUpdate,
  setEditingMemberId,
  setPreview,
  statuses,
  preview,
}) {
  const getDateValue = (field) => {
    const value = editData[field] || member[field];
    return value ? new Date(value).toISOString().split("T")[0] : "";
  };

  const input =
    "border px-2 py-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <>
      {/* Photo */}
      <label className="text-xs cursor-pointer text-indigo-600 underline">
  Change
  <input
    hidden
    type="file"
    name="photo"
    accept="image/*"
    onChange={handleEditChange}
  />
</label>


      <td className="px-3 py-2">
        <input
          name="name"
          value={editData.name ?? member.name ?? ""}
          onChange={handleEditChange}
          className={input}
        />
      </td>

      <td className="px-3 py-2">
        <input
          name="email"
          value={editData.email ?? member.email ?? ""}
          onChange={handleEditChange}
          className={input}
        />
      </td>

      <td className="px-3 py-2">
        <input
          name="phone"
          value={editData.phone ?? member.phone ?? ""}
          onChange={handleEditChange}
          className={input}
        />
      </td>

      <td className="px-3 py-2">
        <input
          name="guardian"
          value={editData.guardian ?? member.guardian ?? ""}
          onChange={handleEditChange}
          className={input}
        />
      </td>

      <td className="px-3 py-2">
        <input
          type="date"
          name="dob"
          value={getDateValue("dob")}
          onChange={handleEditChange}
          className={input}
        />
      </td>

      <td className="px-3 py-2">
        <textarea
  name="permanentAddress"
  rows={2}
  value={editData.permanentAddress ?? member.permanentAddress ?? ""}
  onChange={handleEditChange}
  className={`${input} resize-none text-xs`}
  style={{ minWidth: "180px" }}
/>

      </td>

      <td className="px-3 py-2">
        <input
          type="date"
          name="joiningDate"
          value={getDateValue("joiningDate")}
          onChange={handleEditChange}
          className={input}
        />
      </td>

      <td className="px-3 py-2">
        <input
          name="societyNumber"
          value={editData.societyNumber ?? member.societyNumber ?? ""}
          onChange={handleEditChange}
          className={input}
        />
      </td>

      <td className="px-3 py-2">
        <select
          name="status"
          value={editData.status ?? member.status ?? "active"}
          onChange={handleEditChange}
          className={input}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </td>

      <td className="px-3 py-2 flex gap-2">
        <button
          onClick={() => handleUpdate(member._id)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          <Save size={14} />
        </button>
        <button
          onClick={() => {
            setEditingMemberId(null);
            setPreview(null);
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          <X size={14} />
        </button>
      </td>
    </>
  );
}
