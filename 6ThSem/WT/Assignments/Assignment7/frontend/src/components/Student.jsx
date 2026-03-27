import React, { useState } from 'react'
import Result from './Result'
import './Student.css'

// Props received from Parent (App):
// - studentData: {roll_number, name, course, mse1, ese1, mse2, ese2, mse3, ese3, mse4, ese4}
// - onUpdate: callback function to update parent

function Student({ studentData, onUpdate }) {
  const [marks, setMarks] = useState({
    mse1: studentData.mse1,
    ese1: studentData.ese1,
    mse2: studentData.mse2,
    ese2: studentData.ese2,
    mse3: studentData.mse3,
    ese3: studentData.ese3,
    mse4: studentData.mse4,
    ese4: studentData.ese4,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [tempMarks, setTempMarks] = useState({ ...marks })

  const subjects = [
    { id: 1, name: 'Data Structures' },
    { id: 2, name: 'Web Technologies' },
    { id: 3, name: 'Database Management' },
    { id: 4, name: 'Algorithms' }
  ]

  // Update marks in state
  const handleMarkChange = (e) => {
    const { name, value } = e.target
    setTempMarks(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  // Save marks to backend
  const handleSaveMarks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/update_marks.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roll_number: studentData.roll_number,
          marks: tempMarks
        })
      })
      const data = await response.json()
      if (data.success) {
        setMarks(tempMarks)
        setIsEditing(false)
        onUpdate({
          ...studentData,
          ...tempMarks
        })
      } else {
        alert('Error updating marks: ' + data.message)
      }
    } catch (err) {
      alert('Failed to update marks: ' + err.message)
    }
  }

  const handleCancel = () => {
    setTempMarks({ ...marks })
    setIsEditing(false)
  }

  return (
    <div className="student-card">
      <div className="student-header">
        <h2>{studentData.name}</h2>
        <p className="roll-number">Roll No: {studentData.roll_number}</p>
        <p className="course">{studentData.course}</p>
      </div>

      <div className="marks-section">
        {!isEditing ? (
          <div className="marks-display">
            {subjects.map(subject => (
              <div key={subject.id} className="subject-row">
                <span className="subject-name">{subject.name}</span>
                <div className="marks-info">
                  <span className="mark">
                    MSE: {marks[`mse${subject.id}`]}
                  </span>
                  <span className="mark">
                    ESE: {marks[`ese${subject.id}`]}
                  </span>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn btn-secondary"
            >
              Edit Marks
            </button>
          </div>
        ) : (
          <div className="marks-edit">
            {subjects.map(subject => (
              <div key={subject.id} className="edit-subject">
                <label>{subject.name}</label>
                <div className="edit-marks">
                  <input
                    type="number"
                    name={`mse${subject.id}`}
                    min="0"
                    max="30"
                    value={tempMarks[`mse${subject.id}`]}
                    onChange={handleMarkChange}
                    placeholder="MSE (0-30)"
                  />
                  <input
                    type="number"
                    name={`ese${subject.id}`}
                    min="0"
                    max="70"
                    value={tempMarks[`ese${subject.id}`]}
                    onChange={handleMarkChange}
                    placeholder="ESE (0-70)"
                  />
                </div>
              </div>
            ))}
            <div className="edit-buttons">
              <button onClick={handleSaveMarks} className="btn btn-success">
                Save Marks
              </button>
              <button onClick={handleCancel} className="btn btn-danger">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Component - Child component that receives marks from Student (Parent) */}
      <Result marks={marks} subjects={subjects} />
    </div>
  )
}

export default Student
