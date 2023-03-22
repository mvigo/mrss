document.getElementById('load-feed').addEventListener('click', loadFeed);

async function loadFeed() {
  const feedUrl = document.getElementById('feed-url').value;
  if (!feedUrl) {
    alert('Please enter a valid MRSS feed URL.');
    return;
  }

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      alert('Error loading the MRSS feed. Please check the URL and try again.');
      return;
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    displayVideos(xmlDoc);
  } catch (error) {
    console.error('Error fetching the MRSS feed:', error);
    alert('Error loading the MRSS feed. Please check your internet connection and try again.');
  }
}

function displayVideos(xmlDoc) {
  const videoList = document.getElementById('videos');
  videoList.innerHTML = '';

  const items = xmlDoc.getElementsByTagName('item');
  for (let i = 0; i < items.length; i++) {
    const title = items[i].getElementsByTagName('title')[0].textContent;
    const media = items[i].getElementsByTagName('media:content');
    const thumbnail = items[i].getElementsByTagName('media:thumbnail')[0];

    if (media.length > 0) {
      const videoSources = Array.from(media).map(source => ({
        url: source.getAttribute('url'),
        type: source.getAttribute('type')
      }));

      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${thumbnail.getAttribute('url')}" alt="${title}">
        <h3>${title}</h3>
      `;
      listItem.addEventListener('click', () => playVideo(videoSources, title));
      videoList.appendChild(listItem);
    }
  }
}

function playVideo(videoSources, title) {
  const player = document.getElementById('player');
  player.innerHTML = `
    <h2>${title}</h2>
    <video controls poster="">
      Your browser does not support the video tag.
    </video>
  `;

  const videoElement = player.querySelector('video');
  videoSources.forEach(source => {
    const sourceElement = document.createElement('source');
    sourceElement.src = source.url;
    sourceElement.type = source.type;
    videoElement.appendChild(sourceElement);
  });

  videoElement.load();
}
