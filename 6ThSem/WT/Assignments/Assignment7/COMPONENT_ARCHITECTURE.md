# Component Architecture & Props Flow

## 1. App Component (Parent)

**Location**: `frontend/src/App.jsx`

**Responsibilities**:
- Fetches all students from backend API
- Manages the list of students in state
- Passes student data to Student component via Props
- Handles loading and error states
- Provides refresh functionality

**State**:
```javascript
const [students, setStudents] = useState([])      // Array of student objects
const [loading, setLoading] = useState(true)      // Loading indicator
const [error, setError] = useState(null)          // Error messages
```

**Props Passed to Children**:
```javascript
<Student 
  key={student.roll_number} 
  studentData={student}           // Entire student object with all marks
  onUpdate={handleStudentUpdate}  // Callback to update parent state
/>
```

**Data Structure Passed**:
```javascript
{
  "id": 1,
  "roll_number": "REG001",
  "name": "Aman Kumar",
  "course": "B.Tech CSE",
  "email": "aman@vit.ac.in",
  "mse1": 28,              // Subject 1 - Mid Semester Exam (30%)
  "ese1": 65,              // Subject 1 - End Semester Exam (70%)
  "mse2": 30,              // Subject 2 - MSE
  "ese2": 68,              // Subject 2 - ESE
  "mse3": 25,              // Subject 3 - MSE
  "ese3": 62,              // Subject 3 - ESE
  "mse4": 29,              // Subject 4 - MSE
  "ese4": 70               // Subject 4 - ESE
}
```

---

## 2. Student Component (Child of App)

**Location**: `frontend/src/components/Student.jsx`

**Responsibilities**:
- Receives student data via Props from App
- Manages student marks in local state (useState)
- Allows editing marks
- Sends updated marks to backend
- Notifies parent of updates
- Passes marks to Result component

**Props Received from Parent (App)**:
```javascript
studentData: {
  roll_number, name, course, 
  mse1, ese1, mse2, ese2, 
  mse3, ese3, mse4, ese4
}

onUpdate: Function // Callback to update parent
```

**State Management Using useState()**:
```javascript
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
const [tempMarks, setTempMarks] = useState({...marks})
```

**Props Passed to Result Component**:
```javascript
<Result 
  marks={marks}           // Current marks object
  subjects={subjects}     // Array of subject names and IDs
/>
```

**Subject Array Structure**:
```javascript
[
  { id: 1, name: 'Data Structures' },
  { id: 2, name: 'Web Technologies' },
  { id: 3, name: 'Database Management' },
  { id: 4, name: 'Algorithms' }
]
```

---

## 3. Result Component (Child of Student)

**Location**: `frontend/src/components/Result.jsx`

**Responsibilities**:
- Receives marks from Student component via Props
- Calculates total marks for each subject
- Determines Pass/Fail status
- Displays subject-wise results
- Shows overall statistics
- Provides visual feedback with color coding

**Props Received from Parent (Student)**:
```javascript
marks: {
  mse1: 28, ese1: 65,
  mse2: 30, ese2: 68,
  mse3: 25, ese3: 62,
  mse4: 29, ese4: 70
}

subjects: [
  { id: 1, name: 'Data Structures' },
  { id: 2, name: 'Web Technologies' },
  { id: 3, name: 'Database Management' },
  { id: 4, name: 'Algorithms' }
]
```

**Calculation Logic**:
```javascript
// For each subject:
Total = (MSE × 0.30) + (ESE × 0.70)
Status = Total >= 40 ? 'Pass' : 'Fail'

// Example:
Total = (28 × 0.30) + (65 × 0.70)
Total = 8.4 + 45.5 = 53.9 → PASS ✓

// Failed example:
Total = (20 × 0.30) + (45 × 0.70)
Total = 6 + 31.5 = 37.5 → FAIL ✗
```

**Output Display**:
- Table with marks and calculated totals
- Overall statistics:
  - Average marks across all subjects
  - Number of passing subjects
  - Overall pass/fail status

---

## Data Flow Diagram

```
┌─────────────────────────────────────┐
│     App Component (Parent)          │
│  - Fetches students from API        │
│  - Manages student list state       │
│  - Handles loading, errors          │
└─────────────────┬───────────────────┘
                  │ Props: studentData, onUpdate
                  ▼
┌─────────────────────────────────────┐
│   Student Component (Child 1)       │
│  - useState() manages marks         │
│  - Allows editing marks             │
│  - Updates backend via API          │
│  - Notifies parent via onUpdate()   │
└─────────────────┬───────────────────┘
                  │ Props: marks, subjects
                  ▼
┌─────────────────────────────────────┐
│   Result Component (Child 2)        │
│  - Receives marks and subjects      │
│  - Calculates Pass/Fail             │
│  - Displays results                 │
│  - Shows statistics                 │
└─────────────────────────────────────┘
```

---

## State Management Flow

### App Component
```
API Response
    ↓
[students] state
    ↓
Pass to Student as Props (studentData)
```

### Student Component
```
Props (studentData)
    ↓
useState([marks]) ← Converts Props to State
    ↓
handleSaveMarks() → Updates backend
    ↓
onUpdate() callback → Notifies App
    ↓
Pass [marks] to Result via Props
```

### Result Component
```
Props (marks, subjects)
    ↓
Calculate totals (no state needed)
    ↓
Display results dynamically
    ↓
Color code based on Pass/Fail
```

---

## useState() Usage in Student Component

### Initial State
```javascript
const [marks, setMarks] = useState({...studentData})
```

### Editing Marks
```javascript
const handleMarkChange = (e) => {
  const { name, value } = e.target
  setTempMarks(prev => ({
    ...prev,
    [name]: parseFloat(value) || 0
  }))
}
```

### Saving Changes
```javascript
const handleSaveMarks = async () => {
  // Send to backend
  const response = await fetch('...update_marks.php', {...})
  
  // Update local state
  setMarks(tempMarks)
  
  // Notify parent
  onUpdate({...studentData, ...tempMarks})
  
  // Exit edit mode
  setIsEditing(false)
}
```

---

## Dynamic UI Updates

### Before Edit
```
Student: Aman Kumar
Data Structures: MSE 28, ESE 65
[Edit Marks Button]
```

### During Edit
```
Student: Aman Kumar
Data Structures: [Input: 28] [Input: 65]
[Save Marks] [Cancel]
```

### After Save
```
Student: Aman Kumar
Data Structures: MSE 28, ESE 65 (updated)
Result: Total 53.9 → PASS ✓
[Edit Marks Button]
```

---

## Key Takeaways

1. **Props Flow**: Parent (App) → Child (Student) → Grandchild (Result)
2. **State Management**: useState() in Student for marks editing
3. **Dynamic Updates**: Pass/Fail status updates based on mark changes
4. **Component Reusability**: Each component has single responsibility
5. **Callback Pattern**: onUpdate() ensures parent state stays synchronized

---

## Error Handling

### In App Component
```javascript
catch (err) {
  setError('Failed to fetch students: ' + err.message)
}
```

### In Student Component
```javascript
catch (err) {
  alert('Failed to update marks: ' + err.message)
}
```

### User Feedback
- Loading spinner while fetching
- Error messages displayed to user
- Toast/Alert notifications for operations
- Form validation before submission
