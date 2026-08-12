export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Fetch the user's public Listen2MyRadio page to scrape the dynamic stream token
    const response = await fetch('https://lucasmusic.radio12345.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Vercel Edge Proxy)' }
    });
    
    const html = await response.text();
    
    // Scrape the hidden urladdress div
    const match = html.match(/id="urladdress">\s*(https:\/\/[^<]+?)\s*<\/div>/);
    
    if (match && match[1]) {
      const dynamicStreamUrl = match[1].trim();
      
      // Append cache-busting just in case
      const finalUrl = `${dynamicStreamUrl}&_t=${Date.now()}`;
      
      // Redirect the audio element to the actual secure stream
      return res.redirect(302, finalUrl);
    }
    
    // Fallback if regex fails
    return res.redirect(302, 'http://uk21freenew.listen2myradio.com:30266/;');
  } catch (error) {
    console.error('Failed to scrape dynamic stream URL:', error);
    // Fallback
    return res.redirect(302, 'http://uk21freenew.listen2myradio.com:30266/;');
  }
}
