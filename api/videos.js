import axios from "axios";

export default async function handler(req, res) {

  try {

    // ambil query page manual
    const url = new URL(req.url, `http://${req.headers.host}`);

    const page =
      url.searchParams.get("page") || 1;

    console.log("PAGE:", page);

    const response = await axios.get(
      `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}`
    );

    res.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate"
    );

    res.status(200).json(response.data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

}
