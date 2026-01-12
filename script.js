// Oscar Categories and Predicted Nominees for 2026
const oscarCategories = {
    "Best Picture": [
        "One Battle After Another",
        "Hamnet",
        "Sinners",
        "Frankenstein",
        "Wicked: For Good",
        "F1",
        "Bugonia",
        "Jay Kelly"
    ],
    "Best Director": [
        {"name": "Paul Thomas Anderson", "film": "One Battle After Another"},
        {"name": "Ryan Coogler", "film": "Sinners"},
        {"name": "Guillermo del Toro", "film": "Frankenstein"},
        {"name": "Joachim Trier", "film": "Sentimental Value"},
        {"name": "Chloé Zhao", "film": "Hamnet"}
    ],
    "Best Actor": [
        {"name": "Leonardo DiCaprio", "film": "One Battle After Another"},
        {"name": "Timothée Chalamet", "film": "Marty Supreme"},
        {"name": "Michael B. Jordan", "film": "Sinners"},
        {"name": "Ethan Hawke", "film": "Blue Moon"},
        {"name": "Joel Edgerton", "film": "Train Dreams"},
        {"name": "Oscar Isaac", "film": "Frankenstein"}
    ],
    "Best Actress": [
        {"name": "Jessie Buckley", "film": "Hamnet"},
        {"name": "Renate Reinsve", "film": "Sentimental Value"},
        {"name": "Emma Stone", "film": "Bugonia"},
        {"name": "Amanda Seyfried", "film": "The Testament of Ann Lee"},
        {"name": "Kate Hudson", "film": "Song Sung Blue"}
    ],
    "Best Supporting Actor": [
        {"name": "Jacob Elordi", "film": "Frankenstein"},
        {"name": "Paul Mescal", "film": "Hamnet"},
        {"name": "Sean Penn", "film": "One Battle After Another"},
        {"name": "Adam Sandler", "film": "Jay Kelly"},
        {"name": "Stellan Skarsgård", "film": "Sentimental Value"},
        {"name": "Benicio Del Toro", "film": "One Battle After Another"}
    ],
    "Best Supporting Actress": [
        {"name": "Elle Fanning", "film": "Sentimental Value"},
        {"name": "Ariana Grande", "film": "Wicked: For Good"},
        {"name": "Amy Madigan", "film": "Weapons"},
        {"name": "Wunmi Mosaku", "film": "Sinners"},
        {"name": "Teyana Taylor", "film": "One Battle After Another"}
    ],
    "Best Original Screenplay": [
        "Sinners",
        "Jay Kelly",
        "Marty Supreme",
        "Sorry, Baby",
        "Sentimental Value"
    ],
    "Best Adapted Screenplay": [
        "One Battle After Another",
        "Train Dreams",
        "No Other Choice",
        "Frankenstein",
        "Hamnet"
    ],
    "Best Cinematography": [
        "F1",
        "Frankenstein",
        "Hamnet",
        "One Battle After Another",
        "Sinners"
    ],
    "Best Animated Feature": [
        "KPop Demon Hunters",
        "Zootopia 2",
        "Arco",
        "Little Amelie",
        "Elio",
        "Demon Slayer"
    ],
    "Best Documentary Feature": [
        "Cover-Up",
        "2000 Meters to Andriivka",
        "The Perfect Neighbor",
        "The Librarians"
    ],
    "Best International Feature Film": [
        "Sirât",
        "Sentimental Value",
        "The Secret Agent",
        "No Other Choice",
        "The Voice of Hind..."
    ],
    "Best Costume Design": [
        "Hamnet",
        "Frankenstein",
        "Wicked: For Good",
        "Sinners",
        "Downton Abbey: The Grand..."
    ],
    "Best Sound": [
        "F1",
        "Frankenstein",
        "Sinners",
        "One Battle After Another",
        "Sirât",
        "Warfare"
    ],
    "Best Original Score": [
        "Sinners",
        "Frankenstein",
        "One Battle After Another",
        "Hamnet",
        "Wicked: For Good",
        "Sirât",
        "F1"
    ]
};

// Helper function to format nominee display
function formatNominee(nominee) {
    // Handle serialized "name|||film" strings
    if (typeof nominee === 'string' && nominee.includes('|||')) {
        const [name, film] = nominee.split('|||');
        return film ? `${name} (${film})` : name;
    }
    if (typeof nominee === 'string') {
        return nominee;
    } else if (nominee && nominee.name && nominee.film) {
        return `${nominee.name} (${nominee.film})`;
    }
    return String(nominee);
}

// Helper function to get nominee value for storage/comparison
function getNomineeValue(nominee) {
    if (typeof nominee === 'string') {
        return nominee;
    } else if (nominee && nominee.name && nominee.film) {
        // Stable, order-independent string for objects
        return `${nominee.name}|||${nominee.film}`;
    }
    return String(nominee);
}

// Helper function to compare two nominees (handles both strings and objects)
function compareNominees(nominee1, nominee2) {
    if (!nominee1 || !nominee2) return false;
    const val1 = getNomineeValue(nominee1);
    const val2 = getNomineeValue(nominee2);
    return val1 === val2;
}

// Helper to extract film name from a nominee (for film-based views)
function getFilmFromNominee(nominee) {
    if (!nominee) return null;
    if (typeof nominee === 'string' && nominee.includes('|||')) {
        const parts = nominee.split('|||');
        return parts[1] || parts[0];
    }
    if (typeof nominee === 'string') {
        return nominee;
    }
    if (nominee && nominee.film) {
        return nominee.film;
    }
    return formatNominee(nominee);
}

// Data Storage (loaded from Firebase)
let users = [];
let predictions = {};
let actualWinners = {};
let watchedFilms = {};

// DOM Elements
const userNameInput = document.getElementById('userNameInput');
const addUserBtn = document.getElementById('addUserBtn');
const userSelect = document.getElementById('userSelect');
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
const predictionsContainer = document.getElementById('predictionsContainer');
const resultsContainer = document.getElementById('resultsContainer');
const winnersContainer = document.getElementById('winnersContainer');
const saveWinnersBtn = document.getElementById('saveWinnersBtn');
const viewPredictionsContainer = document.getElementById('viewPredictionsContainer');
const viewPredictionsSort = document.getElementById('viewPredictionsSort');
const viewPredictionsPickToggle = document.getElementById('viewPredictionsPickToggle');
const viewPredictionsPickButtons = document.querySelectorAll('.view-pick-btn');
let viewPredictionsPickType = 'should';
const filmCards = document.querySelectorAll('.film-card');
const watchedCount = document.getElementById('watchedCount');

function encodeFilmKey(title) {
    return encodeURIComponent(title).replace(/\./g, '%2E');
}

function getFilmTitle(card) {
    const titleEl = card.querySelector('.film-title');
    return titleEl ? titleEl.textContent.trim() : '';
}

// Initialize - Load data from Firebase
async function init() {
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined' || typeof database === 'undefined') {
        console.error('Firebase is not initialized. Please check firebase-config.js');
        document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: #eee;"><h1>⚠️ Firebase Not Configured</h1><p>Please set up Firebase in firebase-config.js</p><p>See README.md for instructions.</p></div>';
        return;
    }
    
    setupEventListeners();
    await loadDataFromFirebase();
    updateUserSelect();
    renderPredictions();
    renderWinnersInput();
    renderWatchedFilms();
    setupFirebaseListeners();
}

// Load initial data from Firebase
async function loadDataFromFirebase() {
    try {
        // Load users
        const usersSnapshot = await database.ref('users').once('value');
        const usersData = usersSnapshot.val();
        users = usersData ? Object.keys(usersData) : [];
        
        // Load predictions
        const predictionsSnapshot = await database.ref('predictions').once('value');
        const predictionsData = predictionsSnapshot.val();
        predictions = predictionsData || {};
        
        // Load winners
        const winnersSnapshot = await database.ref('winners').once('value');
        const winnersData = winnersSnapshot.val();
        actualWinners = winnersData || {};

        // Load watched films
        const watchedSnapshot = await database.ref('watched').once('value');
        const watchedData = watchedSnapshot.val();
        watchedFilms = watchedData || {};
    } catch (error) {
        console.error('Error loading data from Firebase:', error);
        // Fallback to empty data if Firebase fails
        users = [];
        predictions = {};
        actualWinners = {};
        watchedFilms = {};
    }
}

// Set up real-time listeners for updates
function setupFirebaseListeners() {
    // Listen for new users
    database.ref('users').on('value', (snapshot) => {
        const usersData = snapshot.val();
        users = usersData ? Object.keys(usersData) : [];
        updateUserSelect();
    });
    
    // Listen for prediction updates
    database.ref('predictions').on('value', (snapshot) => {
        predictions = snapshot.val() || {};
        if (userSelect.value) {
            renderPredictions(userSelect.value);
            renderViewPredictions();
        }
    });
    
    // Listen for winner updates
    database.ref('winners').on('value', (snapshot) => {
        actualWinners = snapshot.val() || {};
        renderWinnersInput();
        renderResults();
    });

    // Listen for watched updates
    database.ref('watched').on('value', (snapshot) => {
        watchedFilms = snapshot.val() || {};
        renderWatchedFilms();
    });
}

// Event Listeners
function setupEventListeners() {
    addUserBtn.addEventListener('click', addUser);
    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addUser();
    });
    userSelect.addEventListener('change', onUserSelect);
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    saveWinnersBtn.addEventListener('click', saveWinners);
    if (viewPredictionsSort) {
        viewPredictionsSort.addEventListener('change', () => {
            renderViewPredictions();
        });
    }
    if (viewPredictionsPickButtons.length > 0) {
        viewPredictionsPickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const pickType = btn.dataset.pick;
                if (!pickType || pickType === viewPredictionsPickType) return;
                viewPredictionsPickType = pickType;
                updateViewPickToggleState();
                renderViewPredictions();
            });
        });
    }

    setupFilmCardListeners();
}

// User Management
async function addUser() {
    const name = userNameInput.value.trim();
    if (name && !users.includes(name)) {
        try {
            // Add user to Firebase
            await database.ref(`users/${name}`).set(true);
            // Initialize empty predictions for new user
            if (!predictions[name]) {
                await database.ref(`predictions/${name}`).set({});
            }
            userNameInput.value = '';
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user. Please try again.');
        }
    }
}

function updateUserSelect() {
    userSelect.innerHTML = '<option value="">-- Select a user --</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });
}

function onUserSelect() {
    const selectedUser = userSelect.value;
    if (selectedUser) {
        renderPredictions(selectedUser);
        renderViewPredictions();
        renderResults();
    }
    renderWatchedFilms(selectedUser);
}

function setupFilmCardListeners() {
    if (filmCards.length === 0) return;
    filmCards.forEach(card => {
        card.addEventListener('click', async () => {
            const user = userSelect.value;
            if (!user) {
                return;
            }
            const title = getFilmTitle(card);
            if (!title) return;
            const key = encodeFilmKey(title);
            const userWatched = watchedFilms[user] || {};
            const isWatched = !!userWatched[key];
            try {
                if (isWatched) {
                    await database.ref(`watched/${user}/${key}`).remove();
                } else {
                    await database.ref(`watched/${user}/${key}`).set(true);
                }
            } catch (error) {
                console.error('Error updating watched films:', error);
                alert('Error updating watched status. Please try again.');
            }
        });
    });
}

function renderWatchedFilms(selectedUser = null) {
    if (filmCards.length === 0 || !watchedCount) return;
    const user = selectedUser || userSelect.value;
    const hasUser = !!user;
    const total = filmCards.length;
    let count = 0;
    filmCards.forEach(card => {
        const title = getFilmTitle(card);
        const watched = user && watchedFilms[user] && watchedFilms[user][encodeFilmKey(title)];
        card.classList.toggle('is-watched', !!watched);
        card.classList.toggle('is-disabled', !hasUser);
        if (watched) count += 1;
    });
    const percent = total ? Math.round((count / total) * 100) : 0;
    watchedCount.textContent = `${hasUser ? count : 0} / ${total} (${hasUser ? percent : 0}%)`;
}

// View Switching
function switchView(viewName) {
    views.forEach(view => view.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${viewName}View`).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    if (viewName === 'results') {
        renderResults();
    }
}

// Render Predictions
function renderPredictions(selectedUser = null) {
    const user = selectedUser || userSelect.value;
    if (!user) {
        predictionsContainer.innerHTML = '<p>Please select a user first.</p>';
        return;
    }
    
    if (!predictions[user]) {
        predictions[user] = {};
    }
    
    predictionsContainer.innerHTML = '';
    
    Object.keys(oscarCategories).forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category;
        categoryCard.appendChild(categoryTitle);
        
        // Create table for radio buttons
        const table = document.createElement('table');
        table.className = 'prediction-table';
        
        // Header row
        const headerRow = document.createElement('tr');
        const nomineeHeader = document.createElement('th');
        nomineeHeader.textContent = 'Nominee';
        headerRow.appendChild(nomineeHeader);
        
        const shouldWinHeader = document.createElement('th');
        shouldWinHeader.textContent = 'Should Win';
        headerRow.appendChild(shouldWinHeader);
        
        const willWinHeader = document.createElement('th');
        willWinHeader.textContent = 'Will Win';
        headerRow.appendChild(willWinHeader);
        
        table.appendChild(headerRow);
        
        // Create rows for each nominee
        oscarCategories[category].forEach(nominee => {
            const row = document.createElement('tr');
            const nomineeValue = getNomineeValue(nominee);
            const nomineeDisplay = formatNominee(nominee);
            const nomineeId = nomineeValue.replace(/[^a-zA-Z0-9]/g, '-');
            
            // Nominee name cell
            const nomineeCell = document.createElement('td');
            nomineeCell.className = 'nominee-cell';
            nomineeCell.textContent = nomineeDisplay;
            row.appendChild(nomineeCell);
            
            // Should Win radio button
            const shouldWinCell = document.createElement('td');
            shouldWinCell.className = 'radio-cell';
            const shouldWinRadio = document.createElement('input');
            shouldWinRadio.type = 'radio';
            shouldWinRadio.name = `shouldWin-${category}-${user}`;
            shouldWinRadio.value = nomineeValue;
            shouldWinRadio.id = `shouldWin-${category}-${user}-${nomineeId}`;
            // Check if this nominee matches the stored prediction
            const storedShouldWin = predictions[user][category]?.shouldWin;
            if (storedShouldWin) {
                const storedValue = getNomineeValue(storedShouldWin);
                if (storedValue === nomineeValue) {
                    shouldWinRadio.checked = true;
                }
            }
            shouldWinRadio.addEventListener('change', async () => {
                try {
                    // Store stable string value in Firebase
                    await database.ref(`predictions/${user}/${category}/shouldWin`).set(nomineeValue);
                } catch (error) {
                    console.error('Error saving prediction:', error);
                    alert('Error saving prediction. Please try again.');
                }
            });
            shouldWinCell.appendChild(shouldWinRadio);
            row.appendChild(shouldWinCell);
            
            // Will Win radio button
            const willWinCell = document.createElement('td');
            willWinCell.className = 'radio-cell';
            const willWinRadio = document.createElement('input');
            willWinRadio.type = 'radio';
            willWinRadio.name = `willWin-${category}-${user}`;
            willWinRadio.value = nomineeValue;
            willWinRadio.id = `willWin-${category}-${user}-${nomineeId}`;
            // Check if this nominee matches the stored prediction
            const storedWillWin = predictions[user][category]?.willWin;
            if (storedWillWin) {
                const storedValue = getNomineeValue(storedWillWin);
                if (storedValue === nomineeValue) {
                    willWinRadio.checked = true;
                }
            }
            willWinRadio.addEventListener('change', async () => {
                try {
                    // Store stable string value in Firebase
                    await database.ref(`predictions/${user}/${category}/willWin`).set(nomineeValue);
                } catch (error) {
                    console.error('Error saving prediction:', error);
                    alert('Error saving prediction. Please try again.');
                }
            });
            willWinCell.appendChild(willWinRadio);
            row.appendChild(willWinCell);
            
            table.appendChild(row);
        });
        
        categoryCard.appendChild(table);
        predictionsContainer.appendChild(categoryCard);
    });
}

// View Predictions (read-only)
function renderViewPredictions() {
    if (!viewPredictionsContainer) return;

    const user = userSelect.value;
    if (!user) {
        viewPredictionsContainer.innerHTML = '<p>Please select a user first.</p>';
        return;
    }

    if (!predictions[user]) {
        viewPredictionsContainer.innerHTML = '<p>No predictions found for this user yet.</p>';
        return;
    }

    const sortMode = viewPredictionsSort ? viewPredictionsSort.value : 'award';
    updateViewPickToggleVisibility(sortMode);

    if (sortMode === 'film') {
        renderViewPredictionsByFilm(user, viewPredictionsPickType);
    } else {
        renderViewPredictionsByAward(user);
    }
}

function renderViewPredictionsByAward(user) {
    viewPredictionsContainer.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'view-predictions-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Award</th><th>Should Win</th><th>Will Win</th>';
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    Object.keys(oscarCategories).forEach(category => {
        const userPred = predictions[user][category] || {};
        const row = document.createElement('tr');

        const awardCell = document.createElement('td');
        awardCell.textContent = category;
        row.appendChild(awardCell);

        const shouldCell = document.createElement('td');
        shouldCell.textContent = userPred.shouldWin ? formatNominee(userPred.shouldWin) : '—';
        row.appendChild(shouldCell);

        const willCell = document.createElement('td');
        willCell.textContent = userPred.willWin ? formatNominee(userPred.willWin) : '—';
        row.appendChild(willCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    viewPredictionsContainer.appendChild(table);
}

function renderViewPredictionsByFilm(user, pickType) {
    viewPredictionsContainer.innerHTML = '';

    // Aggregate by film
    const filmMap = {};
    const isShould = pickType === 'should';
    const pickLabel = isShould ? 'Should Win' : 'Will Win';

    Object.keys(oscarCategories).forEach(category => {
        const userPred = predictions[user][category];
        if (!userPred) return;
        const pickValue = isShould ? userPred.shouldWin : userPred.willWin;
        if (!pickValue) return;
        const filmName = getFilmFromNominee(pickValue);
        if (!filmName) return;
        if (!filmMap[filmName]) {
            filmMap[filmName] = {
                count: 0,
                categories: new Set()
            };
        }
        filmMap[filmName].count += 1;
        filmMap[filmName].categories.add(category);
    });

    const films = Object.keys(filmMap);
    if (films.length === 0) {
        viewPredictionsContainer.innerHTML = `<p>No ${pickLabel.toLowerCase()} predictions yet to sort by film.</p>`;
        return;
    }

    // Sort films by picks, descending
    films.sort((a, b) => {
        const totalA = filmMap[a].count;
        const totalB = filmMap[b].count;
        if (totalB !== totalA) return totalB - totalA;
        return a.localeCompare(b);
    });

    const table = document.createElement('table');
    table.className = 'view-predictions-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Film</th><th>${pickLabel} Picks</th><th>Categories</th>`;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    films.forEach(film => {
        const data = filmMap[film];
        const row = document.createElement('tr');

        const filmCell = document.createElement('td');
        filmCell.textContent = film;
        row.appendChild(filmCell);

        const pickCell = document.createElement('td');
        pickCell.textContent = data.count;
        row.appendChild(pickCell);

        const categoriesCell = document.createElement('td');
        categoriesCell.textContent = Array.from(data.categories).join(', ');
        row.appendChild(categoriesCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    viewPredictionsContainer.appendChild(table);
}

function updateViewPickToggleVisibility(sortMode) {
    if (!viewPredictionsPickToggle) return;
    if (sortMode === 'film') {
        viewPredictionsPickToggle.classList.add('is-visible');
    } else {
        viewPredictionsPickToggle.classList.remove('is-visible');
    }
}

function updateViewPickToggleState() {
    if (viewPredictionsPickButtons.length === 0) return;
    viewPredictionsPickButtons.forEach(btn => {
        const isActive = btn.dataset.pick === viewPredictionsPickType;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

// Render Winners Input
function renderWinnersInput() {
    winnersContainer.innerHTML = '';
    
    Object.keys(oscarCategories).forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category;
        categoryCard.appendChild(categoryTitle);
        
        const select = document.createElement('select');
        select.className = 'winner-select';
        select.id = `winner-${category}`;
        select.innerHTML = '<option value="">-- Select Winner --</option>';
        oscarCategories[category].forEach(opt => {
            const option = document.createElement('option');
            const optValue = getNomineeValue(opt);
            const optDisplay = formatNominee(opt);
            option.value = optValue;
            option.textContent = optDisplay;
            const storedWinner = actualWinners[category];
            if (storedWinner) {
                const storedValue = typeof storedWinner === 'string' ? storedWinner : JSON.stringify(storedWinner);
                if (storedValue === optValue) {
                    option.selected = true;
                }
            }
            select.appendChild(option);
        });
        categoryCard.appendChild(select);
        
        winnersContainer.appendChild(categoryCard);
    });
}

// Save Winners
async function saveWinners() {
    try {
        const winnersToSave = {};
        Object.keys(oscarCategories).forEach(category => {
            const select = document.getElementById(`winner-${category}`);
            if (select.value) {
                // Find the original nominee object/string from the category list
                const selectedValue = select.value;
                const nominee = oscarCategories[category].find(opt => {
                    const optValue = getNomineeValue(opt);
                    return optValue === selectedValue;
                });
                if (nominee) {
                    winnersToSave[category] = nominee;
                }
            }
        });
        // Save all winners to Firebase
        await database.ref('winners').set(winnersToSave);
        alert('Winners saved!');
        renderResults();
    } catch (error) {
        console.error('Error saving winners:', error);
        alert('Error saving winners. Please try again.');
    }
}

// Render Results
function renderResults() {
    if (Object.keys(actualWinners).length === 0) {
        resultsContainer.innerHTML = '<p>No winners have been entered yet. Go to "Enter Winners" to add them.</p>';
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    // Calculate scores for each user
    const userScores = {};
    users.forEach(user => {
        if (!predictions[user]) return;
        
        let shouldWinCorrect = 0;
        let willWinCorrect = 0;
        let totalCategories = 0;
        
        Object.keys(oscarCategories).forEach(category => {
            if (actualWinners[category]) {
                totalCategories++;
                const userPred = predictions[user][category];
                if (userPred) {
                    if (compareNominees(userPred.shouldWin, actualWinners[category])) {
                        shouldWinCorrect++;
                    }
                    if (compareNominees(userPred.willWin, actualWinners[category])) {
                        willWinCorrect++;
                    }
                }
            }
        });
        
        userScores[user] = {
            shouldWin: shouldWinCorrect,
            willWin: willWinCorrect,
            total: totalCategories
        };
    });
    
    // Sort users by total correct predictions
    const sortedUsers = Object.keys(userScores).sort((a, b) => {
        const totalA = userScores[a].shouldWin + userScores[a].willWin;
        const totalB = userScores[b].shouldWin + userScores[b].willWin;
        return totalB - totalA;
    });
    
    // Display score cards
    sortedUsers.forEach(user => {
        const scoreCard = document.createElement('div');
        scoreCard.className = 'score-card';
        
        const header = document.createElement('div');
        header.className = 'score-header';
        header.textContent = user;
        scoreCard.appendChild(header);
        
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'score-value';
        const totalScore = userScores[user].shouldWin + userScores[user].willWin;
        scoreDiv.textContent = `${totalScore} / ${userScores[user].total * 2} correct`;
        scoreCard.appendChild(scoreDiv);
        
        const breakdown = document.createElement('div');
        breakdown.style.marginTop = '10px';
        breakdown.innerHTML = `
            <div>Should Win: ${userScores[user].shouldWin} / ${userScores[user].total}</div>
            <div>Will Win: ${userScores[user].willWin} / ${userScores[user].total}</div>
        `;
        scoreCard.appendChild(breakdown);
        
        resultsContainer.appendChild(scoreCard);
    });
    
    // Detailed comparison table
    const table = document.createElement('table');
    table.className = 'results-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Category</th><th>Actual Winner</th>';
    users.forEach(user => {
        const th = document.createElement('th');
        th.textContent = user;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    Object.keys(oscarCategories).forEach(category => {
        if (!actualWinners[category]) return;
        
        const row = document.createElement('tr');
        const categoryCell = document.createElement('td');
        categoryCell.textContent = category;
        row.appendChild(categoryCell);
        
        const winnerCell = document.createElement('td');
        winnerCell.textContent = formatNominee(actualWinners[category]);
        winnerCell.style.fontWeight = 'bold';
        winnerCell.style.color = '#4ade80';
        row.appendChild(winnerCell);
        
        users.forEach(user => {
            const cell = document.createElement('td');
            if (predictions[user] && predictions[user][category]) {
                const pred = predictions[user][category];
                let content = '';
                if (pred.shouldWin) {
                    const isCorrect = compareNominees(pred.shouldWin, actualWinners[category]);
                    content += `<span class="${isCorrect ? 'correct' : 'incorrect'}">Should: ${formatNominee(pred.shouldWin)}</span>`;
                }
                if (pred.willWin) {
                    const isCorrect = compareNominees(pred.willWin, actualWinners[category]);
                    if (content) content += '<br>';
                    content += `<span class="${isCorrect ? 'correct' : 'incorrect'}">Will: ${formatNominee(pred.willWin)}</span>`;
                }
                cell.innerHTML = content || 'No prediction';
            } else {
                cell.textContent = 'No prediction';
            }
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    resultsContainer.appendChild(table);
}

// Initialize app
init();
