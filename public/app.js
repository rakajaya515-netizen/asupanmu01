const grid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");

let currentPage = 1;
let loading = false;
let hasNext = true;

let allVideos = [];

async function loadVideos() {

  if (loading || !hasNext) return;

  loading = true;

  try {

    const res = await fetch(
      `/api/videos?page=${currentPage}`
    );

    const json = await res.json();

    const videos = json.data || [];

    allVideos.push(...videos);

    renderVideos(allVideos);

    hasNext =
      json.pagination?.currentPage <
      json.pagination?.totalPages;

    currentPage++;

  } catch(err) {

    console.log(err);

  }

  loading = false;

}

function renderVideos(videos) {

  grid.innerHTML = "";

  videos.forEach(video => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a href="${video.url}" target="_blank">

        <img
          src="${video.thumbnail}"
          loading="lazy"
        />

        <div class="overlay">
          <h3>${video.title}</h3>
        </div>

      </a>
    `;

    grid.appendChild(card);

  });

}

window.addEventListener("scroll", () => {

  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 500
  ) {

    loadVideos();

  }

});

searchInput.addEventListener("input", e => {

  const keyword = e.target.value.toLowerCase();

  const filtered = allVideos.filter(v =>
    v.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);

});

loadVideos();
