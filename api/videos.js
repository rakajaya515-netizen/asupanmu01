export default async function handler(req, res) {

  try {

    const page = req.query.page || 1;

    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${process.env.API_KEY}&page=${page}&limit=20`
    );

    const json = await response.json();

    const videos = json.data || [];

    const result = videos.map(video => ({

      id: video.id,

      title: video.title || "No Title",

      thumbnail: video.thumbnail || "",

      watch:
      `https://vizey.net/api/v1/videos?apikey=${process.env.API_KEY}&id=${video.id}`

    }));

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    res.status(200).json(result);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}
