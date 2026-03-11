/*
 * queue.js
 * Handles the "My Requests" page:
 *   1. Loads booked tickets from localStorage
 *   2. Renders them as a clickable list
 *   3. When a ticket is clicked, shows queue tracking
 *   4. Simulated queue countdown + connect flow
 */

document.addEventListener('DOMContentLoaded', function () {
  setupQueuePage();
});

function setupQueuePage() {
  var ticketListCard = document.getElementById('ticketListCard');
  var ticketListContainer = document.getElementById('ticketListContainer');
  var queueDisplay = document.getElementById('queueDisplay');
  var positionEl = document.getElementById('queuePosition');
  var waitTimeEl = document.getElementById('waitTime');
  var statusRing = document.getElementById('statusRing');
  var statusText = document.getElementById('queueStatusText');
  var connectBtn = document.getElementById('connectBtn');
  var backBtn = document.getElementById('backToListBtn');

  var currentPosition = 0;
  var queueInterval;

  // Load and display tickets
  renderTicketList();


  /* ---- Render the list of booked tickets ---- */

  function renderTicketList() {
    var tickets = JSON.parse(localStorage.getItem('fixmypc_tickets') || '[]');

    // If there are no tickets, show an empty state
    if (tickets.length === 0) {
      ticketListContainer.innerHTML =
        '<div class="ticket-list-empty">' +
          '<p>You haven\'t booked any sessions yet.</p>' +
          '<a href="booking.html" class="btn btn-primary">Book a Session</a>' +
        '</div>';
      return;
    }

    // Build a list of clickable ticket items
    var listHTML = '<div class="ticket-list">';

    tickets.forEach(function (ticket) {
      // Make the service name readable (e.g. "software" -> "Software")
      var serviceName = ticket.service
        ? ticket.service.charAt(0).toUpperCase() + ticket.service.slice(1)
        : 'General';

      // Format the date nicely
      var dateStr = ticket.date || 'No date';
      var timeStr = ticket.time || '';

      listHTML +=
        '<div class="ticket-item" data-ticket-id="' + ticket.id + '">' +
          '<div class="ticket-item-left">' +
            '<span class="ticket-item-id">' + ticket.id + '</span>' +
            '<span class="ticket-item-detail">' + serviceName + ' &middot; ' + dateStr + ' ' + timeStr + '</span>' +
          '</div>' +
          '<span class="ticket-item-arrow">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
          '</span>' +
        '</div>';
    });

    listHTML += '</div>';
    ticketListContainer.innerHTML = listHTML;

    // Add click handlers to each ticket
    var ticketItems = ticketListContainer.querySelectorAll('.ticket-item');
    ticketItems.forEach(function (item) {
      item.addEventListener('click', function () {
        openQueueView(item.getAttribute('data-ticket-id'));
      });
    });
  }


  /* ---- Open the queue tracking view for a ticket ---- */

  function openQueueView(ticketId) {
    // Hide ticket list, show queue display
    ticketListCard.style.display = 'none';
    queueDisplay.style.display = 'block';

    // Reset the queue display
    positionEl.textContent = '--';
    waitTimeEl.textContent = '-- mins';
    statusText.textContent = 'Connecting to queue...';
    connectBtn.disabled = true;
    connectBtn.classList.remove('btn-primary');
    connectBtn.classList.add('btn-outline');
    connectBtn.style.animation = '';
    connectBtn.innerHTML = 'Waiting for Technician...';
    statusRing.style.borderColor = 'var(--color-status-yellow)';

    // Start the simulation
    startQueueSimulation();
  }


  /* ---- Back button: return to ticket list ---- */

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      clearInterval(queueInterval);
      queueDisplay.style.display = 'none';
      ticketListCard.style.display = 'block';
    });
  }


  /* ---- Queue Simulation ---- */

  function startQueueSimulation() {
    // Random starting position between 3 and 7
    currentPosition = Math.floor(Math.random() * 5) + 3;
    updateQueueDisplay();

    // Move forward every 4-7 seconds
    clearInterval(queueInterval);
    var interval = Math.floor(Math.random() * 3000) + 4000;

    queueInterval = setInterval(function () {
      if (currentPosition > 1) {
        currentPosition--;
        updateQueueDisplay();
      } else {
        clearInterval(queueInterval);
        showYourTurn();
      }
    }, interval);
  }


  function updateQueueDisplay() {
    positionEl.textContent = currentPosition;

    var estimatedMinutes = currentPosition * 5;
    waitTimeEl.textContent = '~' + estimatedMinutes + ' mins';

    if (currentPosition > 5) {
      setRingStatus('red', 'High wait time. Technicians are busy.');
    } else if (currentPosition > 2) {
      setRingStatus('yellow', 'Moderate wait. Moving forward.');
    } else if (currentPosition === 2) {
      setRingStatus('yellow', 'You are next! Please get ready.');
    }
  }


  function showYourTurn() {
    positionEl.textContent = '1';
    waitTimeEl.textContent = 'Now';
    setRingStatus('green', 'It is your turn!');

    connectBtn.disabled = false;
    connectBtn.classList.remove('btn-outline');
    connectBtn.classList.add('btn-primary');
    connectBtn.style.animation = 'pulse 2s infinite';
    connectBtn.innerHTML =
      'Connect to Technician ' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
  }


  function setRingStatus(color, text) {
    statusText.textContent = text;

    var colorMap = {
      red: 'var(--color-status-red)',
      yellow: 'var(--color-status-yellow)',
      green: 'var(--color-status-green)'
    };

    statusRing.style.borderColor = colorMap[color];
  }


  /* ---- Connect to Technician ---- */

  if (connectBtn) {
    connectBtn.addEventListener('click', function () {
      // Replace the queue view with a "connected" screen
      queueDisplay.innerHTML =
        '<button class="back-link" onclick="location.reload()">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>' +
          'Back to requests' +
        '</button>' +
        '<div class="text-center">' +
          '<div class="success-icon mb-24">' +
            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>' +
          '</div>' +
          '<h2 class="mb-8">Session Connected</h2>' +
          '<p class="text-primary mb-24">Secure remote connection established.</p>' +
          '<div id="sessionTimer" class="mb-24 session-timer">00:00</div>' +
          '<button class="btn btn-outline" onclick="location.reload()">End Session</button>' +
        '</div>';

      // Start a simple timer
      var seconds = 0;
      var timerEl = document.getElementById('sessionTimer');

      setInterval(function () {
        seconds++;
        var m = Math.floor(seconds / 60).toString().padStart(2, '0');
        var s = (seconds % 60).toString().padStart(2, '0');
        if (timerEl) {
          timerEl.textContent = m + ':' + s;
        }
      }, 1000);
    });
  }
}
