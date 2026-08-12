export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=5');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // SHOUTcast v1 metadata endpoint
    const url = 'http://uk21freenew.listen2myradio.com:30266/7.html';
    
    // Fetch directly from the HTTP server (Serverless Functions can do this)
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Vercel Serverless)' }
    });
    
    if (!response.ok) {
      return res.status(200).json({ title: '' }); // Fallback on error
    }

    const text = await response.text();
    
    // The response looks like: <HTML>...<body>listeners,1,peak,max,unique,bitrate,Song Title</body></html>
    // SHOUTcast sometimes injects newlines, so we must use /s (dotAll) flag
    const bodyMatch = text.match(/<body>(.*?)<\/body>/s);
    
    if (bodyMatch && bodyMatch[1]) {
      const parts = bodyMatch[1].split(',');
      // The 7th element (index 6) is the song title
      if (parts.length >= 7) {
        let title = parts[6] || '';
        // If there are commas in the song name, rejoin the rest
        if (parts.length > 7) {
          title = parts.slice(6).join(',');
        }
        return res.status(200).json({ title: title.trim() });
      }
    }

    return res.status(200).json({ title: '' });
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return res.status(200).json({ title: '' });
  }
}
