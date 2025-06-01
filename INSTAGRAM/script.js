// Fungsi untuk menangani form kontak
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    
    // Konfigurasi EmailJS
    const templateParams = {
        from_name: name,
        message: message,
        to_email: 'dilaninf6@gmail.com'
    };

    // Tampilkan loading
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitButton.disabled = true;

    // Kirim email menggunakan EmailJS
    emailjs.send('service_nj947y5', 'template_k28jkce', templateParams)
        .then(function(response) {
            alert('Pesan berhasil dikirim!');
            document.getElementById('contactForm').reset();
        }, function(error) {
            alert('Maaf, terjadi kesalahan. Silakan coba lagi.');
            console.error('Error:', error);
        })
        .finally(function() {
            // Kembalikan tombol ke kondisi awal
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
});

// Fungsi untuk menangani komentar
/*
document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const commentName = document.getElementById('commentName').value;
    const commentText = document.getElementById('commentText').value;
    
    // Buat elemen komentar baru
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-card bg-white p-4 rounded-lg shadow-sm mb-4';
    commentElement.innerHTML = `
        <div class="flex items-center mb-2">
            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                ${commentName.charAt(0).toUpperCase()}
            </div>
            <div class="ml-3">
                <h4 class="font-semibold text-gray-800">${commentName}</h4>
                <p class="text-sm text-gray-500">${new Date().toLocaleDateString('id-ID')}</p>
            </div>
        </div>
        <p class="text-gray-600">${commentText}</p>
    `;
    
    // Tambahkan komentar ke daftar
    document.getElementById('commentsList').prepend(commentElement);
    
    // Reset form
    this.reset();
});
*/

// Animasi scroll halus
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Tambahkan efek hover pada kartu
document.querySelectorAll('.bg-white').forEach(card => {
    card.classList.add('hover-scale');
});

// Music Player Configuration
const songs = [
   
    {
        id: 'dont-look-back',
        title: "Don't Look Back in Anger",
        artist: 'Oasis',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        audio: 'mursidi.mp3' // <-- Ganti URL ini dengan URL audio Don't Look Back in Anger yang valid
    },
];

let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio();

// DOM Elements
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeBtn = document.getElementById('volumeBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const currentSongCover = document.getElementById('currentSongCover');
const currentSongTitle = document.getElementById('currentSongTitle');
const currentSongArtist = document.getElementById('currentSongArtist');

// Initialize player
function initPlayer() {
    loadSong(currentSongIndex);
    
    // Event Listeners
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    volumeBtn.addEventListener('click', toggleMute);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);
    
    // Progress bar control
    progressBar.parentElement.addEventListener('click', (e) => {
        const time = (e.offsetX / e.target.offsetWidth) * audio.duration;
        audio.currentTime = time;
    });
    
    // Song card click events
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', () => {
            const songId = card.dataset.song;
            const songIndex = songs.findIndex(song => song.id === songId);
            if (songIndex !== -1) {
                currentSongIndex = songIndex;
                loadSong(currentSongIndex);
                playSong();
            }
        });
    });
}

// Load song
function loadSong(index) {
    const song = songs[index];
    audio.src = song.audio;
    currentSongCover.src = song.cover;
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
    
     // Reset progress and time display when loading a new song
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00'; // Will be updated by loadedmetadata event
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
}

// Previous/Next
function playPrevious() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    playSong();
}

function playNext() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    playSong();
}

// Volume control
function toggleMute() {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        audio.volume = 1;
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// Progress bar
function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update time displays
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', initPlayer);

// --- Fungsionalitas Photo Gallery Modal ---
const imageModal = document.getElementById('imageModal');
const enlargedImage = document.getElementById('enlargedImage');
const closeModal = document.getElementById('closeModal');
const galleryImages = document.querySelectorAll('.photo-gallery-grid img');

galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        enlargedImage.src = image.src; // Set sumber gambar modal
        imageModal.classList.remove('hidden'); // Tampilkan modal
    });
});

closeModal.addEventListener('click', () => {
    imageModal.classList.add('hidden'); // Sembunyikan modal saat tombol 'x' diklik
});

// Sembunyikan modal saat mengklik di luar gambar
imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        imageModal.classList.add('hidden');
    }
});