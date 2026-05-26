export default async function handler(req, res) {

  try {

    const page =
      Number(req.query.page || 1);

    let allVideos = [];

    // ======================
    // VIZEY
    // ======================

    try {

      const vizeyRes =
      await fetch(

        `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}&limit=50`

      );

      const vizeyJson =
      await vizeyRes.json();

      const vizeyVideos =

      (vizeyJson.data || []).map(v => ({

        id:
        `vz_${v.id}`,

        title:
        v.title || "Untitled",

        thumbnail:
        v.thumbnail ||

        "https://via.placeholder.com/300x450",

        watch:

        v.url ||

        `https://vizey.net/d/${v.id}`,

        source:
        "VIZEY",

        createdAt:

        new Date(

          v.createdAt ||
          Date.now()

        ).getTime()

      }));

      allVideos.push(
        ...vizeyVideos
      );

    } catch(err){

      console.log(
        "VIZEY ERROR",
        err.message
      );

    }

    // ======================
    // DOOD
    // ======================

    try {

      const doodRes =
      await fetch(

        `https://doodapi.co/api/file/list?key=${process.env.DOOD_API_KEY}&page=${page}`

      );

      const doodJson =
      await doodRes.json();

      const doodVideos =

      (
        doodJson.result?.files || []
      ).map(v => ({

        id:
        `dd_${v.file_code}`,

        title:
        v.title || "Untitled",

        thumbnail:

        v.splash_img ||

        "https://via.placeholder.com/300x450",

        watch:

        `https://dood.so/e/${v.file_code}`,

        source:
        "DOOD",

        createdAt:

        new Date(

          v.uploaded ||
          Date.now()

        ).getTime()

      }));

      allVideos.push(
        ...doodVideos
      );

    } catch(err){

      console.log(
        "DOOD ERROR",
        err.message
      );

    }

    // ======================
    // HAPUS DUPLIKAT
    // ======================

    const uniqueVideos =

      Array.from(

        new Map(

          allVideos.map(v => [

            v.id,
            v

          ])

        ).values()

      );

    // ======================
    // SORT TERBARU
    // ======================

    uniqueVideos.sort(

      (a,b)=>

      b.createdAt -
      a.createdAt

    );

    // ======================
    // CACHE
    // ======================

    res.setHeader(

      "Cache-Control",

      "s-maxage=300, stale-while-revalidate"

    );

    // ======================
    // RESULT
    // ======================

    res.status(200).json(

      uniqueVideos

    );

  } catch(err){

    res.status(500).json({

      error:
      err.message

    });

  }

}
