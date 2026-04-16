const jobs = [
  {
    id: 1,
    job_title: 'Frontend Engineer',
    company_name: 'Acme Co',
    location: 'Remote',
    description: 'Build delightful user interfaces with React and modern tooling.',
    slug: 'frontend-engineer-acme',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    is_active: true,
  },
  {
    id: 2,
    job_title: 'Backend Engineer',
    company_name: 'Nova Systems',
    location: 'San Francisco, CA',
    description: 'Work on scalable APIs and data systems.',
    slug: 'backend-engineer-nova',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    is_active: true,
  },
  {
    id: 3,
    job_title: 'Product Designer',
    company_name: 'Studio Works',
    location: 'London, UK',
    description: 'Design beautiful and accessible product experiences.',
    slug: 'product-designer-studioworks',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    is_active: true,
  },
  {
    id: 4,
    job_title: 'Software Engineer (Full-stack)',
    company_name: 'Tata Digital',
    location: 'Bengaluru, India',
    description: 'Build end-to-end features using React, Node.js and modern tooling.',
    slug: 'software-engineer-tata-digital',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    is_active: true,
  },
  {
    id: 5,
    job_title: 'Frontend Developer',
    company_name: 'Flipkart',
    location: 'Bengaluru, India',
    description: 'Work on large-scale frontend applications with a performance focus.',
    slug: 'frontend-developer-flipkart',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    is_active: true,
  },
  {
    id: 6,
    job_title: 'Backend Developer',
    company_name: 'Infosys',
    location: 'Hyderabad, India',
    description: 'Design and implement microservices and scalable APIs.',
    slug: 'backend-developer-infosys',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    is_active: true,
  },
  {
    id: 7,
    job_title: 'Data Scientist',
    company_name: 'Wipro',
    location: 'Pune, India',
    description: 'Build ML models and productionize data pipelines.',
    slug: 'data-scientist-wipro',
    posted_date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    is_active: true,
  },
  {
    id: 8,
    job_title: 'DevOps Engineer',
    company_name: 'HCL Technologies',
    location: 'Noida, India',
    description: 'Deploy and maintain cloud infrastructure using Kubernetes and Docker.',
    slug: 'devops-engineer-hcl',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    is_active: true,
  },
  {
    id: 9,
    job_title: 'QA Engineer',
    company_name: 'Tech Mahindra',
    location: 'Chennai, India',
    description: 'Ensure software quality through automated and manual testing.',
    slug: 'qa-engineer-techmahindra',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    is_active: true,
  },
  {
    id: 10,
    job_title: 'React Developer',
    company_name: 'Amazon',
    location: 'Seattle, WA',
    description: 'Build modern web applications for AWS services.',
    slug: 'react-developer-amazon',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    is_active: true,
  },
  {
    id: 11,
    job_title: 'Machine Learning Engineer',
    company_name: 'Google',
    location: 'Mountain View, CA',
    description: 'Develop ML models for search and recommendation systems.',
    slug: 'ml-engineer-google',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    is_active: true,
  },
  {
    id: 12,
    job_title: 'Full Stack Developer',
    company_name: 'Microsoft',
    location: 'Toronto, Canada',
    description: 'Work on cloud-based solutions using .NET and Azure.',
    slug: 'fullstack-microsoft',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    is_active: true,
  },
  {
    id: 13,
    job_title: 'UI/UX Designer',
    company_name: 'Apple',
    location: 'Cupertino, CA',
    description: 'Design intuitive interfaces for next-generation Apple products.',
    slug: 'uiux-designer-apple',
    posted_date: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    is_active: true,
  },
];

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default {
  async getJobs({ active_only } = {}) {
    let result = jobs.slice().sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    if (active_only) result = result.filter((j) => j.is_active);
    return clone(result);
  },

  async getJobBySlug(slug) {
    const j = jobs.find((x) => x.slug === slug) || null;
    return clone(j);
  },

  async createJob(payload) {
    const id = jobs.length ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;
    const job = {
      id,
      posted_date: new Date().toISOString(),
      is_active: true,
      ...payload,
    };
    jobs.push(job);
    return clone(job);
  },

  async updateJob(id, updates) {
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error('Not found');
    jobs[idx] = { ...jobs[idx], ...updates };
    return clone(jobs[idx]);
  },

  async deleteJob(id) {
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) throw new Error('Not found');
    jobs.splice(idx, 1);
    return true;
  }
};
