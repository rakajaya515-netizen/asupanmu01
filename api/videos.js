export default async function handler(req, res) {

  try {

    const page = req.query.page || 1;

    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}`
    );

    const json = await response.json();

    const videos = await Promise.all(

      (json.data || []).map(async (v) => {

        try {

          // ambil detail video
          const detailRes = await fetch(
            `https://vizey.net/api/v1/videos?apikey=${process.env.VIZEY_API_KEY}&id=${v.id}`
          );

          const detail = await detailRes.json();

          return {

            id: v.id,

            title: v.title || "No Title",

            thumbnail: v.thumbnail,

            // LINK ASLI DARI API
            watch:
              detail?.data?.url ||

              detail?.data?.embed_url ||

              "#",

            createdAt: v.createdAt,

            source: "VIZEY"

          };

        } catch {

          return null;

        }

      })

    );

    // hapus null
    const cleanVideos =
      videos.filter(Boolean);

    // urut terbaru
    cleanVideos.sort((a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
    );

    // cache ringan
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    res.status(200).json(cleanVideos);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}
