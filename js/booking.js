/*
 * booking.js
 * Handles everything on the Booking page:
 *   1. Pre-filling the service dropdown from URL params
 *   2. Time slot selection
 *   3. Form submission + success modal
 *   4. Auto-detect hardware specs
 *   5. Voice note recording
 */

document.addEventListener('DOMContentLoaded', function () {
  prefillServiceFromURL();
  setupBookingForm();
  setupHardwareDetect();
  setupAudioRecorder();
});


/* ---- 1. Pre-fill service from URL ---- */

function prefillServiceFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  var serviceParam = urlParams.get('service');

  if (!serviceParam) return;

  var select = document.getElementById('issueCategory');
  if (!select) return;

  // Match the first part (e.g. "software-os" becomes "software")
  var baseCategory = serviceParam.split('-')[0];

  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === baseCategory) {
      select.selectedIndex = i;
      break;
    }
  }
}


/* ---- 2 & 3. Booking Form + Time Slots ---- */

function setupBookingForm() {
  var form = document.getElementById('bookingForm');
  var slotButtons = document.querySelectorAll('.time-slot');
  var selectedTimeInput = document.getElementById('selectedTime');
  var dateInput = document.getElementById('bookingDate');

  // When a time slot is clicked, mark it as selected
  slotButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Remove "selected" from all slots first
      slotButtons.forEach(function (b) {
        b.classList.remove('selected');
      });

      // Mark this one as selected
      btn.classList.add('selected');
      selectedTimeInput.value = btn.getAttribute('data-time');
    });
  });

  // When the form is submitted, show the success modal
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Make sure the user picked a date and a time
      if (!selectedTimeInput.value || !dateInput.value) {
        alert('Please select a date and a time slot.');
        return;
      }

      // Generate a random ticket ID like "TKT-4821"
      var ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('ticketIdDisplay').textContent = ticketId;

      // Save this ticket to localStorage so it shows up on the queue page
      saveTicketToStorage({
        id: ticketId,
        service: document.getElementById('issueCategory').value,
        date: dateInput.value,
        time: selectedTimeInput.value
      });

      // Show the modal
      var modal = document.getElementById('successModal');
      modal.classList.add('active');
    });
  }

  // "Track Queue Status" button inside the modal
  var closeBtn = document.getElementById('closeModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      window.location.href = 'queue.html';
    });
  }
}


/* ---- Save ticket to localStorage ---- */

function saveTicketToStorage(ticket) {
  // Get existing tickets (or start with an empty list)
  var tickets = JSON.parse(localStorage.getItem('fixmypc_tickets') || '[]');

  // Add the new ticket to the beginning of the list
  tickets.unshift(ticket);

  // Save back to localStorage
  localStorage.setItem('fixmypc_tickets', JSON.stringify(tickets));
}


/* ---- 4. Auto-Detect Hardware ---- */

function setupHardwareDetect() {
  var detectBtn = document.getElementById('autoDetectBtn');
  if (!detectBtn) return;

  detectBtn.addEventListener('click', function () {
    var osInput = document.getElementById('sysOs');
    var cpuInput = document.getElementById('sysCpu');
    var ramInput = document.getElementById('sysRam');
    var displayInput = document.getElementById('sysDisplay');

    // Show a loading state on the button
    var originalHTML = detectBtn.innerHTML;
    detectBtn.innerHTML = 'Detecting...';
    detectBtn.disabled = true;

    // Small delay to simulate detection
    setTimeout(function () {
      // Detect the operating system from the browser's user agent
      var os = 'Unknown OS';
      var ua = navigator.userAgent;
      if (ua.indexOf('Win') !== -1) os = 'Windows';
      if (ua.indexOf('Mac') !== -1) os = 'macOS';
      if (ua.indexOf('Linux') !== -1) os = 'Linux';
      if (ua.indexOf('Android') !== -1) os = 'Android';
      if (ua.indexOf('like Mac') !== -1) os = 'iOS';
      osInput.value = os;

      // Detect CPU cores
      if (navigator.hardwareConcurrency) {
        cpuInput.value = navigator.hardwareConcurrency + ' logical cores';
      } else {
        cpuInput.value = 'Unknown Processor';
      }

      // Detect RAM (only works in some browsers)
      if (navigator.deviceMemory) {
        ramInput.value = '~' + navigator.deviceMemory + ' GB';
      } else {
        ramInput.value = 'Unknown RAM';
      }

      // Detect screen resolution
      displayInput.value = window.screen.width + ' x ' + window.screen.height;

      // Update the button to show success
      detectBtn.innerHTML = 'Detected Successfully';
      detectBtn.classList.remove('btn-detect');
      detectBtn.classList.add('btn-primary');
    }, 800);
  });
}


/* ---- 5. Voice Note Recorder ---- */

function setupAudioRecorder() {
  var recordBtn = document.getElementById('recordBtn');
  var stopBtn = document.getElementById('stopBtn');
  var playBtn = document.getElementById('playBtn');
  var deleteBtn = document.getElementById('deleteBtn');
  var statusEl = document.getElementById('audioStatus');

  if (!recordBtn) return;

  var mediaRecorder;
  var audioChunks = [];
  var audioBlob = null;
  var audioUrl = null;
  var audioPlayer = new Audio();

  // Start recording
  recordBtn.addEventListener('click', function () {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        // Collect audio data as it comes in
        mediaRecorder.ondataavailable = function (event) {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        // When recording stops, save the audio
        mediaRecorder.onstop = function () {
          audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          audioUrl = URL.createObjectURL(audioBlob);
          audioPlayer.src = audioUrl;

          statusEl.textContent = 'Recording saved.';
          statusEl.className = 'audio-status text-primary';

          // Show play/delete, hide record/stop
          recordBtn.classList.add('hidden-override');
          stopBtn.classList.add('hidden-override');
          playBtn.classList.remove('hidden-override');
          deleteBtn.classList.remove('hidden-override');

          // Release the microphone
          stream.getTracks().forEach(function (track) {
            track.stop();
          });
        };

        mediaRecorder.start();
        statusEl.textContent = 'Recording...';
        statusEl.className = 'audio-status text-sm';

        // Show stop, hide record
        recordBtn.classList.add('hidden-override');
        stopBtn.classList.remove('hidden-override');
      })
      .catch(function (err) {
        console.error('Error accessing microphone:', err);
        statusEl.textContent = 'Mic access denied or unavailable.';
      });
  });

  // Stop recording
  stopBtn.addEventListener('click', function () {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  });

  // Play recording
  playBtn.addEventListener('click', function () {
    if (audioPlayer.src) {
      audioPlayer.play();
      statusEl.textContent = 'Playing...';
      audioPlayer.onended = function () {
        statusEl.textContent = 'Recording saved.';
      };
    }
  });

  // Delete recording
  deleteBtn.addEventListener('click', function () {
    audioBlob = null;
    audioUrl = null;
    audioPlayer.src = '';

    statusEl.textContent = 'Ready to record.';
    statusEl.className = 'audio-status text-muted text-sm';

    // Show record, hide play/delete
    recordBtn.classList.remove('hidden-override');
    playBtn.classList.add('hidden-override');
    deleteBtn.classList.add('hidden-override');
  });
}
