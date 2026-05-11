import axios from "axios";

export default async function handler(req, res) {

  try {

    let page = 1;
    let totalPages = 10;

    let allVideos = [];

    do {

      const response = await axios.get(
        `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}`
      );

      const result = response.data;

      // gabungkan video
      if (result?.data) {
        allVideos.push(...result.data);
      }

      // ambil total halaman
      totalPages = result?.pagination?.totalPages || 1;

      console.log(`Page ${page}/${totalPages}`);

      page++;

    } while (page <= totalPages);

    // cache ringan
    res.setHeader(
      "Cache-Control",
      "s-maxage=600, stale-while-revalidate"
    );

    res.status(200).json({
      success: true,
      total: allVideos.length,
      pages: totalPages,
      data: allVideos
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

}
