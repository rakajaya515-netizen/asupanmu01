export default async function handler(req, res) {

  try {

    const url = new URL(
      req.url,
      `http://${req.headers.host}`
    );

    const page =
      url.searchParams.get("page") || 1;

    // random anti cache
    const unique =
      Date.now() + "_" +
      Math.floor(Math.random() * 999999);

    const apiUrl =
      `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}&nocache=${unique}`;

    console.log(apiUrl);

    const response = await fetch(apiUrl, {

      method: "GET",

      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      }

    });

    const data = await response.json();

    // disable cache vercel
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    res.setHeader(
      "Pragma",
      "no-cache"
    );

    res.setHeader(
      "Expires",
      "0"
    );

    res.status(200).json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

}
