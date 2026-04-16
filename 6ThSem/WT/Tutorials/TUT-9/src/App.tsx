import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<JobList />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="jobs/:slug" element={<JobDetail />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
