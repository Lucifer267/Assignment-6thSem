import db from './_localDb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');

  try {
    const jobs = await db.getJobs({ active_only: true });


    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    const escapeXml = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const truncate = (str, len = 200) => {
      if (!str) return '';
      if (str.length <= len) return str;
      return str.substring(0, len) + '...';
    };

    const rssItems = jobs.map(job => `
    <item>
      <title>${escapeXml(job.job_title)} at ${escapeXml(job.company_name)}</title>
      <link>${baseUrl}/jobs/${escapeXml(job.slug)}</link>
      <description>${escapeXml(truncate(job.description))}</description>
      <pubDate>${new Date(job.posted_date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/jobs/${escapeXml(job.slug)}</guid>
    </item>`).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JobFlow - Latest Job Listings</title>
    <link>${baseUrl}</link>
    <description>The latest job opportunities from top companies</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>${rssItems}
  </channel>
</rss>`;

    res.status(200).send(rssFeed);
  } catch (err) {
    console.error('RSS error:', err);
    res.status(500).send('<?xml version="1.0"?><error>Failed to generate feed</error>');
  }
}
