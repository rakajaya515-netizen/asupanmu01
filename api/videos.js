import axios from "axios";

export default async function handler(req, res) {

  try {

    let page = 1;
    let hasNext = true;

    let allVideos = [];

    while (hasNext) {

      const response = await axios.get(
        `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}`
      );

      const result = response.data;

      if (result?.data?.length > 0) {

        allVideos.push(...result.data);

      }

      hasNext = result?.pagination?.hasNext;

      page++;

      // safety limit
      if (page > 100) break;

    }

    // cache ringan
    res.setHeader(
      "Cache-Control",
      "s-maxage=600, stale-while-revalidate"
    );

    res.status(200).json({
      success: true,
      total: allVideos.length,
      data: allVideos
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

}
