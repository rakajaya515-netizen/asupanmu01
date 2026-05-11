const grid =
document.getElementById("videoGrid");

const searchInput =
document.getElementById("searchInput");

const loadingText =
document.getElementById("loading");

let currentPage = 1;

let loading = false;

let hasNext = true;

let allVideos = [];

async function loadVideos() {

  if (loading || !hasNext) return;

  loading = true;

  loadingText.style.display = "block";

  try {

    const res = await fetch(
      `/api/videos?page=${currentPage}`
    );

    const json = await res.json();

    const videos = json.data || [];

    // simpan semua
    allVideos.push(...videos);

    // tampilkan video baru
    appendVideos(videos);

    // cek next page
    hasNext =
      json.pagination.currentPage <
      json.pagination.totalPages;

    currentPage++;

  } catch(err) {

    console.log(err);

  }

  loadingText.style.display = "none";

  loading = false;

}

function appendVideos(videos) {

  videos.forEach(video => {

    const card =
    document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <a
        href="${video.url}"
        target="_blank"
      >

        <img
          src="${video.thumbnail}"
          alt="${video.title}"
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

searchInput.addEventListener(
  "input",
  e => {

    const keyword =
    e.target.value.toLowerCase();

    grid.innerHTML = "";

    const filtered =
    allVideos.filter(v =>
      v.title
      .toLowerCase()
      .includes(keyword)
    );

    appendVideos(filtered);

  }
);

window.addEventListener(
  "scroll",
  () => {

    if (
      window.innerHeight +
      window.scrollY >=
      document.body.offsetHeight - 700
    ) {

      loadVideos();

    }

  }
);

// pertama load
loadVideos();
