document.getElementById('load-feed').addEventListener('click', () => {
  const feedUrl = document.getElementById('feed-url').value;
  if (!feedUrl) return;

  fetch(feedUrl)
    .then(response => response.text())
    .then(str => new DOMParser().parseFromString(str, "application/xml"))
    .then(xmlDoc => displayVideos(xmlDoc))
    .catch(err => {
      alert('Error loading the MRSS feed. Please check your internet connection and try again.');
      console.error(err);
    });
});

function displayVideos(xmlDoc) {
  const videoList = document.getElementById('videos');
  videoList.innerHTML = '';

  const items = xmlDoc.getElementsByTagName('item');
  for (let i = 0; i < items.length; i++) {
    const title = items[i].getElementsByTagName('title')[0].textContent;
    const pubDate = items[i].getElementsByTagName('pubDate')[0]?.textContent;
    const media = items[i].getElementsByTagName('media:content');
    const thumbnail = items[i].getElementsByTagName('media:thumbnail')[0];
    const keywords = items[i].getElementsByTagName('media:keywords')[0]?.textContent;
    const description = items[i].getElementsByTagName('description')[0]?.textContent;

    if (media.length > 0) {
      const videoSources = Array.from(media).map(source => ({
        url: source.getAttribute('url'),
        type: source.getAttribute('type')
      }));

      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${thumbnail.getAttribute('url')}" alt="${title}">
        <div>
          <h3>${title}</h3>
          <p>${pubDate ? pubDate : 'N/A'}</p> <!-- Added pubDate below the title -->
        </div>
      `;
      listItem.addEventListener('click', () => playVideo(videoSources, title, pubDate, keywords, description));
      videoList.appendChild(listItem);
    }
  }
}

function playVideo(videoSources, title, pubDate, keywords, description) {
  const player = document.getElementById('player');
  player.innerHTML = '';

  const video = document.createElement('video');
  video.controls = true;

  for (const source of videoSources) {
    const sourceElement = document.createElement('source');
    sourceElement.src = source.url;
    sourceElement.type = source.type;
    video.appendChild(sourceElement);
  }

  player.appendChild(video);
  video.play();

  const videoInfo = document.createElement('div');
  videoInfo.classList.add('video-info');
  videoInfo.innerHTML = `
    <p><strong>Title:</strong> ${title}</p>
    <p><strong>Publication Date:</strong> ${pubDate ? pubDate : 'N/A'}</p>
    <p><strong>Keywords:</strong> ${keywords ? keywords : 'N/A'}</p>
    <p><strong>Description:</strong> ${description ? description : 'N/A'}</p>
  `;
  player.appendChild(videoInfo);
}
