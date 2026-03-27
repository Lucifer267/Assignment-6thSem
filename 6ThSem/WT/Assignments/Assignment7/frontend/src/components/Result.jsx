import React from 'react'
import './Result.css'

// Props received from Parent (Student component):
// - marks: {mse1, ese1, mse2, ese2, mse3, ese3, mse4, ese4}
// - subjects: array of subject objects

function Result({ marks, subjects }) {
  // Calculate result for each subject
  // Total = MSE (30%) + ESE (70%)
  const calculateSubjectResult = (mseMarks, eseMarks) => {
    const total = (mseMarks * 0.30) + (eseMarks * 0.70)
    return {
      total: total.toFixed(2),
      status: total >= 40 ? 'Pass' : 'Fail'
    }
  }

  // Calculate results for all subjects
  const subjectResults = subjects.map(subject => {
    const mseKey = `mse${subject.id}`
    const eseKey = `ese${subject.id}`
    const result = calculateSubjectResult(marks[mseKey], marks[eseKey])
    return {
      ...subject,
      result
    }
  })

  // Calculate overall result
  const totalMarks = subjectResults.reduce((sum, sr) => sum + parseFloat(sr.result.total), 0)
  const averageMarks = (totalMarks / subjects.length).toFixed(2)
  const passingSubjects = subjectResults.filter(sr => sr.result.status === 'Pass').length
  const overallStatus = passingSubjects === subjects.length ? 'Pass' : 'Fail'

  return (
    <div className="result-card">
      <h3>Result Summary</h3>
      
      <div className="subject-results">
        <table className="results-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>MSE (30%)</th>
              <th>ESE (70%)</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.map(sr => (
              <tr key={sr.id} className={`status-${sr.result.status.toLowerCase()}`}>
                <td>{sr.name}</td>
                <td>{marks[`mse${sr.id}`]}</td>
                <td>{marks[`ese${sr.id}`]}</td>
                <td>{sr.result.total}</td>
                <td className={`status-badge ${sr.result.status.toLowerCase()}`}>
                  {sr.result.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overall-result">
        <div className="result-stat">
          <label>Average Marks</label>
          <p className="stat-value">{averageMarks}/100</p>
        </div>
        <div className="result-stat">
          <label>Passing Subjects</label>
          <p className="stat-value">{passingSubjects}/{subjects.length}</p>
        </div>
        <div className={`result-stat overall-status-${overallStatus.toLowerCase()}`}>
          <label>Overall Status</label>
          <p className={`stat-value status-badge ${overallStatus.toLowerCase()}`}>
            {overallStatus}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Result
