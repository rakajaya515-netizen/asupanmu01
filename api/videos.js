export default async function handler(req, res) {

  try {

    const page = req.query.page || 1;

    let allVideos = [];

    // ======================
    // VIZEY
    // ======================

    try {

      const vizeyRes = await fetch(
        `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}&limit=20`
      );

      const vizeyJson =
        await vizeyRes.json();

      const vizeyVideos =
        (vizeyJson.data || []).map(v => ({

          id: v.id,

          title:
            v.title || "No Title",

          thumbnail:
            v.thumbnail || "",

          watch:
            `https://vizey.net/view/${v.id}`,

          source: "VIZEY"

        }));

      allVideos.push(...vizeyVideos);

    } catch(err) {

      console.log("VIZEY ERROR:", err);

    }

    // ======================
    // DOOD
    // ======================

    try {

      const doodRes = await fetch(
        `https://doodapi.co/api/file/list?key=${process.env.DOOD_API_KEY}`
      );

      const doodJson =
        await doodRes.json();

      console.log(doodJson);

      const doodVideos =
        (
          doodJson.result?.files || []
        ).map(v => ({

          id: v.file_code,

          title:
            v.title || "No Title",

          thumbnail:
            v.splash_img ||
            v.single_img ||
            "",

          watch:
            `https://dood.so/d/${v.file_code}`,

          source: "DOOD"

        }));

      allVideos.push(...doodVideos);

    } catch(err) {

      console.log("DOOD ERROR:", err);

    }

    // acak video
    allVideos.sort(() =>
      Math.random() - 0.5
    );

    // cache
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
