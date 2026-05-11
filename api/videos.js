export default async function handler(req, res) {

  try {

    // ambil list video
    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${process.env.API_KEY}&page=1&limit=50`
    );

    const json = await response.json();

    const videos = json.data || [];

    // format data untuk frontend
    const formatted = videos.map(video => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,

      // halaman detail asli
      watch:
      `https://vizey.net/api/v1/videos?apikey=${process.env.API_KEY}&id=${video.id}`
    }));

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    res.status(200).json(formatted);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
}
