"use client";

import { Pencil, Trash2 } from "lucide-react";

export default function ReadOnlyRow({
  member,
  setEditingMemberId,
  setEditData,
  handleDelete,
  setSelectedMemberId,
}) {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "-";

  return (
    <>
      <td className="px-3 py-2">
        {member.photo ? (
          <img
            src={member.photo}
            className="w-12 h-12 rounded-full object-cover border"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs">
            N/A
          </div>
        )}
      </td>

      <td
        onClick={() => setSelectedMemberId(member._id)}
        className="cursor-pointer font-semibold hover:text-indigo-600"
      >
        {member.name}
      </td>

      <td>{member.email}</td>
      <td>{member.phone}</td>
      <td>{member.guardian}</td>
      <td>{formatDate(member.dob)}</td>
      <td>{formatDate(member.joiningDate)}</td>
      <td>{member.societyNumber}</td>
      <td>{member.role}</td>

      <td>
        <span
          className={`px-2 py-1 rounded text-xs ${
            member.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {member.status}
        </span>
      </td>

      <td className="flex gap-2">
        <button
          onClick={() => {
            setEditingMemberId(member._id);
            setEditData(member);
          }}
          className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded"
        >
          <Pencil size={14} />
        </button>

        <button
          onClick={() => handleDelete(member._id)}
          className="p-2 bg-red-100 hover:bg-red-200 rounded"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </>
  );
}
