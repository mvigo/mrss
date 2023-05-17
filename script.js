function playVideo(videoSources, title, pubDate, keywords, description) {
  const player = document.getElementById('player');
  player.innerHTML = '';

  const video = document.createElement('video');
  video.controls = true;
  player.appendChild(video);

  const playbackSpeedSelector = document.createElement('select');
  const speeds = [0.5, 1.0, 1.5, 2.0];

  speeds.forEach(speed => {
    const option = document.createElement('option');
    option.value = speed;
    option.text = `${speed}x`;
    if (speed === 1.0) option.selected = true; // default speed
    playbackSpeedSelector.appendChild(option);
  });

  playbackSpeedSelector.addEventListener('change', function() {
    video.playbackRate = this.value;
  });

  player.appendChild(playbackSpeedSelector);

  for (const source of videoSources) {
    const sourceElement = document.createElement('source');
    sourceElement.src = source.url;
    sourceElement.type = source.type;
    video.appendChild(sourceElement);
  }

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
