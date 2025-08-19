document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Show student name from localStorage
  const studentName = localStorage.getItem("studentName");
  if (studentName) {
    document.getElementById("welcome").textContent = `Welcome, ${studentName}`;
  }

  const playlistInput = document.getElementById("playlistInput");
  const loadBtn = document.getElementById("loadBtn");
  const videoList = document.getElementById("videoList");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  const API_KEY = "AIzaSyATjJnBaiRSV1ziCskE6dfCVqzxxw1eBNc"; // ✅ Replace with your API key

  function extractPlaylistId(url) {
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  function updateProgress() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const checked = document.querySelectorAll("input[type='checkbox']:checked");

    if (checkboxes.length === 0) return;

    const percent = Math.round((checked.length / checkboxes.length) * 100);

    // Update circular progress bar
    const circle = document.getElementById("progressCircle");
    const radius = 35; // matches r in <circle>
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    circle.style.strokeDashoffset = offset;
    document.getElementById("progressText").textContent = `${percent}%`;
  }


  loadBtn.addEventListener("click", async () => {
    const url = playlistInput.value.trim();
    const playlistId = extractPlaylistId(url);

    if (!playlistId) {
      alert("❌ Please enter a valid YouTube playlist link!");
      return;
    }

    videoList.innerHTML = "Loading videos...";

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
      );
      const data = await response.json();

      videoList.innerHTML = "";

      data.items.forEach((item, index) => {
        const videoTitle = item.snippet.title;
        const videoId = item.snippet.resourceId.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" id="video-${index}">
          <label for="video-${index}">
            <a href="${videoUrl}" target="_blank">${videoTitle}</a>
          </label>
        `;

        // 🔹 Update progress when checkbox changes
        li.querySelector("input").addEventListener("change", updateProgress);

        videoList.appendChild(li);
      });

      // Reset progress bar
      updateProgress();
    } catch (error) {
      videoList.innerHTML = "❌ Failed to load playlist.";
      console.error(error);
    }
  });
});
