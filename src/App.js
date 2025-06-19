// App.js
import React, { useState } from "react";
import "./App.css"; // Ensure you have the CSS file

function App() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    study_time: "",
    failures: "",
    absences: "",
    G1: "",
    G2: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    let genderNumeric;
    if (formData.gender === "M") genderNumeric = 0;
    else if (formData.gender === "F") genderNumeric = 1;
    else {
      setError("Please select a valid gender");
      setLoading(false);
      return;
    }

    const payload = {
      gender: genderNumeric,
      age: Number(formData.age),
      study_time: Number(formData.study_time),
      failures: Number(formData.failures),
      absences: Number(formData.absences),
      G1: Number(formData.G1),
      G2: Number(formData.G2),
    };

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError("Prediction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Student Pass Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </label>
        <label>
          Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </label>
        <label>
          Study Time:
          <input type="number" name="study_time" value={formData.study_time} onChange={handleChange} required />
        </label>
        <label>
          Failures:
          <input type="number" name="failures" value={formData.failures} onChange={handleChange} required />
        </label>
        <label>
          Absences:
          <input type="number" name="absences" value={formData.absences} onChange={handleChange} required />
        </label>
        <label>
          1st Grading Period:
          <input type="number" name="G1" value={formData.G1} onChange={handleChange} required />
        </label>
        <label>
          2nd Grading Period:
          <input type="number" name="G2" value={formData.G2} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {prediction && <div className="success">Prediction: {prediction}</div>}
      {error && <div className="error">Error: {error}</div>}
    </div>
  );
}

export default App;
