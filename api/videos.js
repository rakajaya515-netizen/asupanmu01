export default async function handler(req, res) {

  try {

    let allVideos = [];

    // jumlah page yang mau diambil
    const totalPages = 5;

    for (let page = 1; page <= totalPages; page++) {

      const response = await fetch(
        `https://vizey.net/api/v1/list?apikey=${process.env.API_KEY}&page=${page}`
      );

      const json = await response.json();

      const videos =
        json.data ||
        [];

      allVideos.push(...videos);

    }

    // hapus duplikat
    const uniqueVideos =
      Array.from(
        new Map(
          allVideos.map(v => [v.id, v])
        ).values()
      );

    // format data
    const result =
      uniqueVideos.map(video => ({

        id: video.id,

        title:
          video.title ||
          "No Title",

        thumbnail:
          video.thumbnail ||
          "",

        watch:
          `https://vizey.net/api/v1/videos?apikey=${process.env.API_KEY}&id=${video.id}`

      }));

    // cache ringan
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
