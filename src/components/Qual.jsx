import React, { useState } from "react";

export default function Qualification({ qualification, setQualification }) {
  const [newQualification, setNewQualification] = useState("");

  function handleDelete(item) {
    const updatedqualification = qualification.filter((qual) => qual !== item);
    setQualification(updatedqualification);
  }

  function handleInputChange(e) {
    setNewQualification(e.target.value);
  }

  function handleAdd() {
    if (newQualification.trim() !== "") {
      setQualification((prev) => [...prev, newQualification]);
      setNewQualification("");
    }
  }

  return (
    <div>
      <ul>
        {qualification.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleDelete(item)}>-</button>
          </li>
        ))}
        <li>
          <input
            type="text"
            value={newQualification}
            onChange={handleInputChange}
            required
          />
          <button onClick={handleAdd}>+</button>
        </li>
      </ul>
    </div>
  );
}
