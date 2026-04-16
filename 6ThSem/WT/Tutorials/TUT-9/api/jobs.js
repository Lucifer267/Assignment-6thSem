import db from './_localDb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, active_only } = req.query;

      if (slug) {
        const data = await db.getJobBySlug(slug);
        if (!data) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(data);
      }

      const data = await db.getJobs({ active_only: active_only === 'true' });
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { job_title, company_name, location, description, slug, is_active } = req.body;
      const data = await db.createJob({ job_title, company_name, location, description, slug, is_active });
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const data = await db.updateJob(id, updates);
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await db.deleteJob(id);
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
