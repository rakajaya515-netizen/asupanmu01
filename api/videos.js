import axios from "axios";

export default async function handler(req, res) {

  try {

    const page = req.query.page || 1;

    const response = await axios.get(
      `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}`
    );

    // cache ringan
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
