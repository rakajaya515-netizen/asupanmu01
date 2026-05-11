export default async function handler(req, res) {

  try {

    let allVideos = [];

    // ambil 7 halaman
    for(let page = 1; page <= 7; page++) {

      const response = await fetch(
        `https://vizey.net/api/v1/list?apikey=${process.env.API_KEY}&page=${page}`
      );

      const json = await response.json();

      if(json.data) {
        allVideos.push(...json.data);
      }
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate"
    );

    res.status(200).json(allVideos);

  } catch(err) {

    res.status(500).json({
      error: err.message
    });

  }
}
