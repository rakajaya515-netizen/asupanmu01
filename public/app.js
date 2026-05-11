const videoGrid = document.getElementById('videoGrid');
async function loadVideos() {
  if (isLoading) return;

  isLoading = true;
  loading.style.display = 'block';

  try {
    const response = await fetch(`/api/videos?page=${currentPage}`);
    const result = await response.json();

    if (result.success) {
      const videos = result.data;

      allVideos = [...allVideos, ...videos];

      renderVideos(allVideos);

      currentPage++;
    }
  } catch (err) {
    console.error(err);
  }

  loading.style.display = 'none';
  isLoading = false;
}

function renderVideos(videos) {
  videoGrid.innerHTML = '';

  videos.forEach(video => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <a href="https://vizey.net/api/v1/videos?apikey=dummy&id=${video.id}" target="_blank">
        <img class="thumbnail" src="${video.thumbnail}" alt="${video.title}">

        <div class="card-content">
          <div class="title">${video.title}</div>
          <div class="views">${video.views || 0} views</div>
        </div>
      </a>
    `;

    videoGrid.appendChild(card);
  });
}

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = allVideos.filter(video =>
    video.title.toLowerCase().includes(keyword)
  );

  renderVideos(filtered);
});

window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 500
  ) {
    loadVideos();
  }
});

loadVideos();
