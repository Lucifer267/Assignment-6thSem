import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState('student')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/get_students.php')
      const data = await response.json()
      if (data.success) {
        setStudents(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to fetch students: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1>VIT Result Portal</h1>
            <p>Vishwakarma Institute of Technology</p>
          </div>
          <div className="mode-toggle">
            <button className={`mode-btn ${mode === 'student' ? 'active' : ''}`} onClick={() => setMode('student')}>
              Student View
            </button>
            <button className={`mode-btn ${mode === 'admin' ? 'active' : ''}`} onClick={() => setMode('admin')}>
              Admin Panel
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {mode === 'student' && <StudentPortal students={students} loading={loading} error={error} onRefresh={fetchStudents} />}
        {mode === 'admin' && <AdminPanel students={students} loading={loading} error={error} setError={setError} setStudents={setStudents} />}
      </main>
    </div>
  )
}

function StudentPortal({ students, loading, error, onRefresh }) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchRoll, setSearchRoll] = useState('')

  const getSubjectsByDegree = (course) => {
    if (course.includes('CSE') || course.includes('Computer')) {
      return [
        { id: 1, name: 'Data Structures', code: 'CS201' },
        { id: 2, name: 'Web Technologies', code: 'CS202' },
        { id: 3, name: 'Database Management', code: 'CS203' },
        { id: 4, name: 'Algorithms', code: 'CS204' }
      ]
    } else if (course.includes('IT') || course.includes('Information')) {
      return [
        { id: 1, name: 'Network Security', code: 'IT201' },
        { id: 2, name: 'Cloud Computing', code: 'IT202' },
        { id: 3, name: 'Big Data Analytics', code: 'IT203' },
        { id: 4, name: 'Mobile Applications', code: 'IT204' }
      ]
    } else if (course.includes('Chemical')) {
      return [
        { id: 1, name: 'Chemical Thermodynamics', code: 'CH201' },
        { id: 2, name: 'Organic Chemistry', code: 'CH202' },
        { id: 3, name: 'Process Engineering', code: 'CH203' },
        { id: 4, name: 'Unit Operations', code: 'CH204' }
      ]
    } else if (course.includes('MBBS')) {
      return [
        { id: 1, name: 'Anatomy', code: 'MB201' },
        { id: 2, name: 'Physiology', code: 'MB202' },
        { id: 3, name: 'Pathology', code: 'MB203' },
        { id: 4, name: 'Pharmacology', code: 'MB204' }
      ]
    } else if (course.includes('L.L.B') || course.includes('Law')) {
      return [
        { id: 1, name: 'Constitutional Law', code: 'LW201' },
        { id: 2, name: 'Criminal Law', code: 'LW202' },
        { id: 3, name: 'Contract Law', code: 'LW203' },
        { id: 4, name: 'Corporate Law', code: 'LW204' }
      ]
    }
    return [
      { id: 1, name: 'Subject 1', code: 'GEN201' },
      { id: 2, name: 'Subject 2', code: 'GEN202' },
      { id: 3, name: 'Subject 3', code: 'GEN203' },
      { id: 4, name: 'Subject 4', code: 'GEN204' }
    ]
  }

  const filteredStudents = students.filter(s =>
    s.roll_number.toLowerCase().includes(searchRoll.toLowerCase()) ||
    s.name.toLowerCase().includes(searchRoll.toLowerCase())
  )

  const calculateTotal = (student) => {
    const total = parseFloat(student.mse1 || 0) + parseFloat(student.ese1 || 0) +
      parseFloat(student.mse2 || 0) + parseFloat(student.ese2 || 0) +
      parseFloat(student.mse3 || 0) + parseFloat(student.ese3 || 0) +
      parseFloat(student.mse4 || 0) + parseFloat(student.ese4 || 0)
    return total.toFixed(2)
  }

  const calculateGrade = (marks) => {
    const total = parseFloat(marks)
    if (total >= 320) return 'A'
    if (total >= 280) return 'B'
    if (total >= 240) return 'C'
    if (total >= 200) return 'D'
    return 'F'
  }

  if (selectedStudent) {
    return (
      <StudentDetailView student={selectedStudent} subjects={getSubjectsByDegree(selectedStudent.course)} onBack={() => setSelectedStudent(null)} />
    )
  }

  return (
    <div className="portal-container">
      <div className="portal-header">
        <h2>📊 View Results</h2>
        <div className="search-box">
          <input type="text" placeholder="Search by Roll No or Name..." value={searchRoll} onChange={(e) => setSearchRoll(e.target.value)} className="search-input" />
          <button onClick={onRefresh} className="btn-refresh">🔄 Refresh</button>
        </div>
      </div>

      {loading && <div className="loading">⏳ Loading results...</div>}
      {error && <div className="error-message">❌ {error}</div>}

      {!loading && filteredStudents.length > 0 && (
        <div className="student-cards">
          {filteredStudents.map(student => (
            <div key={student.roll_number} className="student-card-compact">
              <div className="card-header"><h3>{student.name}</h3><span className="roll-badge">{student.roll_number}</span></div>
              <div className="card-body">
                <p><strong>Course:</strong> {student.course}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Total Marks:</strong> {calculateTotal(student)} / 400</p>
                <p><strong>Grade:</strong> <span className={`grade grade-${calculateGrade(calculateTotal(student))}`}>{calculateGrade(calculateTotal(student))}</span></p>
              </div>
              <button onClick={() => setSelectedStudent(student)} className="btn-view">View Details →</button>
            </div>
          ))}
        </div>
      )}
      {!loading && filteredStudents.length === 0 && <div className="no-data">No students found</div>}
    </div>
  )
}

function StudentDetailView({ student, subjects, onBack }) {
  return (
    <div className="detail-view">
      <button onClick={onBack} className="btn-back">← Back</button>
      <div className="student-info-card">
        <div className="info-grid">
          <div className="info-item"><strong>Name:</strong> {student.name}</div>
          <div className="info-item"><strong>Roll Number:</strong> {student.roll_number}</div>
          <div className="info-item"><strong>Course:</strong> {student.course}</div>
          <div className="info-item"><strong>Email:</strong> {student.email}</div>
        </div>
      </div>
      <div className="marks-table-container">
        <h3>Detailed Marks</h3>
        <table className="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>MSE</th>
              <th>ESE</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, idx) => {
              const mse = parseFloat(student[`mse${subject.id}`] || 0)
              const ese = parseFloat(student[`ese${subject.id}`] || 0)
              const total = mse + ese
              return (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>{subject.code}</td>
                  <td className="mark-cell">{mse.toFixed(2)}</td>
                  <td className="mark-cell">{ese.toFixed(2)}</td>
                  <td className="mark-cell total"><strong>{total.toFixed(2)}</strong></td>
                </tr>
              )
            })}
            <tr className="total-row">
              <td colSpan="2"><strong>Total</strong></td>
              <td colSpan="3" className="total-value"><strong>{calculateTotalMarks(student).toFixed(2)} / 400</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function calculateTotalMarks(student) {
  let total = 0
  for (let i = 1; i <= 4; i++) {
    total += parseFloat(student[`mse${i}`] || 0)
    total += parseFloat(student[`ese${i}`] || 0)
  }
  return total
}

function AdminPanel({ students, loading, error, setError, setStudents }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({ roll_number: '', name: '', course: '', email: '' })
  const [marks, setMarks] = useState({ mse1: '', ese1: '', mse2: '', ese2: '', mse3: '', ese3: '', mse4: '', ese4: '' })
  const [inlineEditingRoll, setInlineEditingRoll] = useState(null)
  const [inlineMarks, setInlineMarks] = useState({})
  const [inlineIdentityRoll, setInlineIdentityRoll] = useState(null)
  const [inlineIdentity, setInlineIdentity] = useState({ name: '', email: '' })

  const getSubjectsByDegree = (course) => {
    if (course.includes('CSE') || course.includes('Computer')) {
      return [
        { id: 1, name: 'Data Structures', code: 'CS201' },
        { id: 2, name: 'Web Technologies', code: 'CS202' },
        { id: 3, name: 'Database Management', code: 'CS203' },
        { id: 4, name: 'Algorithms', code: 'CS204' }
      ]
    } else if (course.includes('IT') || course.includes('Information')) {
      return [
        { id: 1, name: 'Network Security', code: 'IT201' },
        { id: 2, name: 'Cloud Computing', code: 'IT202' },
        { id: 3, name: 'Big Data Analytics', code: 'IT203' },
        { id: 4, name: 'Mobile Applications', code: 'IT204' }
      ]
    } else if (course.includes('Chemical')) {
      return [
        { id: 1, name: 'Chemical Thermodynamics', code: 'CH201' },
        { id: 2, name: 'Organic Chemistry', code: 'CH202' },
        { id: 3, name: 'Process Engineering', code: 'CH203' },
        { id: 4, name: 'Unit Operations', code: 'CH204' }
      ]
    } else if (course.includes('MBBS')) {
      return [
        { id: 1, name: 'Anatomy', code: 'MB201' },
        { id: 2, name: 'Physiology', code: 'MB202' },
        { id: 3, name: 'Pathology', code: 'MB203' },
        { id: 4, name: 'Pharmacology', code: 'MB204' }
      ]
    } else if (course.includes('L.L.B') || course.includes('Law')) {
      return [
        { id: 1, name: 'Constitutional Law', code: 'LW201' },
        { id: 2, name: 'Criminal Law', code: 'LW202' },
        { id: 3, name: 'Contract Law', code: 'LW203' },
        { id: 4, name: 'Corporate Law', code: 'LW204' }
      ]
    }
    return [
      { id: 1, name: 'Subject 1', code: 'GEN201' },
      { id: 2, name: 'Subject 2', code: 'GEN202' },
      { id: 3, name: 'Subject 3', code: 'GEN203' },
      { id: 4, name: 'Subject 4', code: 'GEN204' }
    ]
  }

  const getMarkColor = (mark) => {
    const m = parseFloat(mark || 0)
    if (m >= 70) return '#27ae60' // Green - Good
    if (m >= 45) return '#f39c12' // Yellow - Average
    return '#e74c3c' // Red - Low
  }

  const getGrade = (total) => {
    const t = parseFloat(total)
    if (t >= 320) return { grade: 'A', color: '#27ae60' }
    if (t >= 280) return { grade: 'B', color: '#3498db' }
    if (t >= 240) return { grade: 'C', color: '#f39c12' }
    if (t >= 200) return { grade: 'D', color: '#e67e22' }
    return { grade: 'F', color: '#e74c3c' }
  }

  const calculateTotal = (student, updatedMarks = null) => {
    const m = updatedMarks || student
    let total = 0
    for (let i = 1; i <= 4; i++) {
      total += parseFloat(m[`mse${i}`] || 0)
      total += parseFloat(m[`ese${i}`] || 0)
    }
    return total
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/create_student.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        setStudents([...students, data.data])
        setFormData({ roll_number: '', name: '', course: '', email: '' })
        setShowAddForm(false)
        setError(null)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to add student: ' + err.message)
    }
  }

  const handleDeleteStudent = async (rollNumber) => {
    if (!window.confirm(`Delete student ${rollNumber}?`)) return
    try {
      const response = await fetch('http://localhost:8000/api/delete_student.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roll_number: rollNumber })
      })
      const data = await response.json()
      if (data.success) {
        setStudents(students.filter(s => s.roll_number !== rollNumber))
        alert('Student deleted successfully!')
        setError(null)
      } else {
        setError(data.message || 'Failed to delete student')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    }
  }

  const handleStartInlineEdit = (student) => {
    setInlineEditingRoll(student.roll_number)
    setInlineMarks({
      mse1: student.mse1, ese1: student.ese1,
      mse2: student.mse2, ese2: student.ese2,
      mse3: student.mse3, ese3: student.ese3,
      mse4: student.mse4, ese4: student.ese4
    })
  }

  const handleAutoGenerateMarks = async () => {
    const updatedStudents = students.map((student, idx) => {
      let marks = {}
      const variant = Math.random() // Random for each click
      
      if (variant < 0.4) {
        // High performers - Green (A/B grades)
        marks = {
          mse1: 25 + Math.random() * 5,
          ese1: 60 + Math.random() * 10,
          mse2: 27 + Math.random() * 3,
          ese2: 65 + Math.random() * 8,
          mse3: 26 + Math.random() * 4,
          ese3: 62 + Math.random() * 9,
          mse4: 28 + Math.random() * 2,
          ese4: 68 + Math.random() * 7
        }
      } else if (variant < 0.7) {
        // Average performers - Yellow (C grades)
        marks = {
          mse1: 16 + Math.random() * 5,
          ese1: 45 + Math.random() * 8,
          mse2: 18 + Math.random() * 4,
          ese2: 48 + Math.random() * 7,
          mse3: 17 + Math.random() * 5,
          ese3: 44 + Math.random() * 8,
          mse4: 19 + Math.random() * 4,
          ese4: 50 + Math.random() * 7
        }
      } else {
        // Low performers - Red (D/F grades)
        marks = {
          mse1: 9 + Math.random() * 5,
          ese1: 30 + Math.random() * 8,
          mse2: 11 + Math.random() * 5,
          ese2: 33 + Math.random() * 8,
          mse3: 8 + Math.random() * 5,
          ese3: 28 + Math.random() * 8,
          mse4: 10 + Math.random() * 5,
          ese4: 31 + Math.random() * 8
        }
      }
      
      // Round to 2 decimal places
      Object.keys(marks).forEach(key => {
        marks[key] = Math.round(marks[key] * 100) / 100
      })
      
      return { ...student, ...marks }
    })

    setError(null)
    let successCount = 0
    let failedCount = 0
    const errors = []

    for (const student of updatedStudents) {
      try {
        const marksData = {
          mse1: parseFloat(student.mse1),
          ese1: parseFloat(student.ese1),
          mse2: parseFloat(student.mse2),
          ese2: parseFloat(student.ese2),
          mse3: parseFloat(student.mse3),
          ese3: parseFloat(student.ese3),
          mse4: parseFloat(student.mse4),
          ese4: parseFloat(student.ese4)
        }

        console.log(`Updating ${student.roll_number}:`, marksData)

        const response = await fetch('http://localhost:8000/api/update_marks.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            roll_number: student.roll_number, 
            marks: marksData
          })
        })
        
        console.log(`Response status for ${student.roll_number}:`, response.status)
        
        const text = await response.text()
        console.log(`Response text for ${student.roll_number}:`, text)
        
        const data = JSON.parse(text)
        if (data.success) {
          successCount++
        } else {
          failedCount++
          errors.push(`${student.roll_number}: ${data.message}`)
          console.error(`Failed for ${student.roll_number}:`, data.message)
        }
      } catch (err) {
        failedCount++
        errors.push(`${student.roll_number}: ${err.message}`)
        console.error(`Error for ${student.roll_number}:`, err)
      }
    }

    // Always update frontend state so user sees changes
    setStudents(updatedStudents)

    if (successCount > 0) {
      if (failedCount > 0) {
        alert(`✓ Updated ${successCount} students\n❌ Failed to update ${failedCount} students`)
      } else {
        alert('✓ All students updated successfully! Click again to randomize different marks.')
      }
    } else if (failedCount > 0) {
      alert(`❌ Failed to update all students\n\nChecking console...`)
    }
  }

  const handleInlineMarkChange = (field, value) => {
    setInlineMarks(prev => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  const handleStartInlineIdentityEdit = (student) => {
    setInlineEditingRoll(null)
    setInlineIdentityRoll(student.roll_number)
    setInlineIdentity({
      name: student.name || '',
      email: student.email || ''
    })
  }

  const handleInlineIdentityChange = (field, value) => {
    setInlineIdentity(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveInlineIdentity = async (rollNumber) => {
    const payload = {
      roll_number: rollNumber,
      name: inlineIdentity.name.trim(),
      email: inlineIdentity.email.trim()
    }

    if (!payload.name) {
      setError('Name cannot be empty')
      return
    }

    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/update_student_identity.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (data.success) {
        setStudents(students.map(s => s.roll_number === rollNumber ? { ...s, name: payload.name, email: payload.email } : s))
        setInlineIdentityRoll(null)
        setError(null)
        alert('Student details updated successfully!')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to update student details: ' + err.message)
    }
  }

  const handleSaveInlineMarks = async (rollNumber) => {
    try {
      const response = await fetch('http://localhost:8000/api/update_marks.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roll_number: rollNumber, marks: inlineMarks })
      })
      const data = await response.json()
      if (data.success) {
        setStudents(students.map(s => s.roll_number === rollNumber ? { ...s, ...inlineMarks } : s))
        setInlineEditingRoll(null)
        setError(null)
        alert('Marks updated successfully!')
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to save: ' + err.message)
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>⚙️ Admin Dashboard</h2>
        <div className="header-actions">
          <button onClick={handleAutoGenerateMarks} className="btn-demo">
            🎲 Demo Marks
          </button>
          <button onClick={() => { setShowAddForm(!showAddForm); setInlineEditingRoll(null) }} className="btn-primary">
            {showAddForm ? '✕ Cancel' : '+ Add New Student'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {showAddForm && (
        <form onSubmit={handleAddStudent} className="add-student-form">
          <input type="text" placeholder="Roll Number" value={formData.roll_number} onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })} required className="form-input" />
          <input type="text" placeholder="Student Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="form-input" />
          <input type="text" placeholder="Course" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} required className="form-input" />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" />
          <button type="submit" className="btn-success">✓ Add Student</button>
        </form>
      )}

      {loading ? <div className="loading">⏳ Loading...</div> : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Course</th>
                <th>Email</th>
                <th>Marks (Total)</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const total = calculateTotal(student)
                const gradeInfo = getGrade(total)
                const isEditing = inlineEditingRoll === student.roll_number
                const isIdentityEditing = inlineIdentityRoll === student.roll_number

                return (
                  <tr key={student.roll_number} className={isEditing || isIdentityEditing ? 'editing-row' : ''}>
                    <td><strong>{student.roll_number}</strong></td>
                    <td>
                      {isIdentityEditing ? (
                        <input
                          type="text"
                          value={inlineIdentity.name}
                          onChange={(e) => handleInlineIdentityChange('name', e.target.value)}
                          className="inline-identity-input"
                          placeholder="Student Name"
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td>{student.course}</td>
                    <td>
                      {isIdentityEditing ? (
                        <input
                          type="email"
                          value={inlineIdentity.email}
                          onChange={(e) => handleInlineIdentityChange('email', e.target.value)}
                          className="inline-identity-input"
                          placeholder="Email"
                        />
                      ) : (
                        student.email
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="inline-marks-edit">
                          {getSubjectsByDegree(student.course).map((subject, idx) => (
                            <div key={idx} className="inline-mark-pair">
                              <span className="subject-label" title={subject.name}>{subject.code}</span>
                              <input type="number" min="0" max="50" value={inlineMarks[`mse${subject.id}`]} onChange={(e) => handleInlineMarkChange(`mse${subject.id}`, e.target.value)} className="inline-mark-input" placeholder="MSE" />
                              <span>/</span>
                              <input type="number" min="0" max="50" value={inlineMarks[`ese${subject.id}`]} onChange={(e) => handleInlineMarkChange(`ese${subject.id}`, e.target.value)} className="inline-mark-input" placeholder="ESE" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="marks-circle" style={{ background: getMarkColor(total) }} onClick={() => handleStartInlineEdit(student)}>
                          <span className="marks-text">{total.toFixed(0)}/400</span>
                          <span className="marks-percent">{((total / 400) * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="grade-circle" style={{ background: gradeInfo.color }}>
                        <span className="grade-text">{gradeInfo.grade}</span>
                      </div>
                    </td>
                    <td className="action-buttons">
                      {isEditing ? (
                        <>
                          <button onClick={() => handleSaveInlineMarks(student.roll_number)} className="btn-save">💾 Save</button>
                          <button onClick={() => setInlineEditingRoll(null)} className="btn-cancel">✕ Cancel</button>
                        </>
                      ) : isIdentityEditing ? (
                        <>
                          <button onClick={() => handleSaveInlineIdentity(student.roll_number)} className="btn-save">💾 Save User</button>
                          <button onClick={() => setInlineIdentityRoll(null)} className="btn-cancel">✕ Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleStartInlineEdit(student)} className="btn-edit">✏️ Edit</button>
                          <button onClick={() => handleStartInlineIdentityEdit(student)} className="btn-edit-user">👤 Edit User</button>
                          <button onClick={() => handleDeleteStudent(student.roll_number)} className="btn-delete">🗑️ Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
