/**
 * Velocity Typing Engine
 * State Management & Real-Time Performance Analytics
 */

document.addEventListener('DOMContentLoaded', () => {
    // Repository pool of test string items
    const textPassages = [
        "In the design of modern software architecture, engineering paradigms prioritize decoupled execution streams. Performance relies on minimizing runtime overhead and avoiding unnecessary recalculations within rendering trees.",
        "Asynchronous event delegation models handle incoming telemetry signals across distributed network processes. Scalable structures achieve throughput parity by isolating computational processing loops from layout parsing calculations.",
        "A standard interface profile exposes clean encapsulation mechanics while native optimization strategies maintain system fluidity. Strict typing controls prevent common runtime reference exceptions during high-frequency mutations.",
        "Functional data synchronization processes memory arrays across isolated heap spaces. Real-time updates optimize performance characteristics by managing layout stability during complex system state transformations."
    ];

    // State Management Engine Parameters
    let sourceTextArray = [];
    let characterIndex = 0;
    let totalKeystrokes = 0;
    let errors = 0;
    let durationSetting = 30; // Seconds configuration standard default
    let timeRemaining = 30;
    let timerActive = false;
    let intervalEngine = null;
    let highScore = 0;

    // DOM Hierarchy Mapping Nodes
    const textDisplay = document.getElementById('text-display');
    const hiddenCatcher = document.getElementById('keyboard-handler');
    const playgroundCard = document.getElementById('playground-card');
    const focusOverlay = document.getElementById('focus-overlay');
    const durationSelect = document.getElementById('duration-select');
    const restartBtn = document.getElementById('restart-btn');

    // Live Numeric Outputs Cache
    const wpmDisplay = document.getElementById('metric-wpm');
    const accuracyDisplay = document.getElementById('metric-accuracy');
    const timeDisplay = document.getElementById('metric-time');
    const errorsDisplay = document.getElementById('metric-errors');
    const highScoreDisplay = document.getElementById('metric-highscore');

    /**
     * Initializes core operational states and system hooks
     */
    function initializeSuite() {
        loadLocalStorageData();
        bindInputListeners();
        resetTestParameters();
    }

    /**
     * Pulls historical maximum WPM levels from persistent store
     */
    function loadLocalStorageData() {
        const storedHighScore = localStorage.getItem('velocity_high_score');
        if (storedHighScore) {
            highScore = parseInt(storedHighScore, 10);
        }
        highScoreDisplay.textContent = highScore;
    }

    /**
     * Registers interface interaction handlers
     */
    function bindInputListeners() {
        // Intercept click bindings to trap input streams safely
        focusOverlay.addEventListener('click', () => hiddenCatcher.focus());
        playgroundCard.addEventListener('click', () => hiddenCatcher.focus());

        // Attach processing channels to intercept raw keystrokes
        hiddenCatcher.addEventListener('input', processKeystrokeStream);
        hiddenCatcher.addEventListener('keydown', processSpecialKeys);

        // Bind mutation triggers to state settings modifiers
        durationSelect.addEventListener('change', (e) => {
            durationSetting = parseInt(e.target.value, 10);
            resetTestParameters();
        });

        restartBtn.addEventListener('click', resetTestParameters);
    }

    /**
     * Resets runtime parameters to match new configuration variables
     */
    function resetTestParameters() {
        clearInterval(intervalEngine);
        intervalEngine = null;
        timerActive = false;
        
        characterIndex = 0;
        totalKeystrokes = 0;
        errors = 0;
        timeRemaining = durationSetting;
        hiddenCatcher.value = '';
        hiddenCatcher.disabled = false;

        // Fetch new random passage text
        const currentPassage = textPassages[Math.floor(Math.random() * textPassages.length)];
        sourceTextArray = currentPassage.split('');

        // Transform character segments into explicit DOM elements
        textDisplay.innerHTML = '';
        sourceTextArray.forEach((char) => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char;
            textDisplay.appendChild(span);
        });

        // Set pointer position marker
        updateCaretMarker();
        updateDisplayMetrics();
    }

    /**
     * Updates active position attributes on real-time text layouts
     */
    function updateCaretMarker() {
        const spanNodes = textDisplay.querySelectorAll('.char');
        spanNodes.forEach((span, idx) => {
            span.classList.remove('current');
            if (idx === characterIndex) {
                span.classList.add('current');
            }
        });
    }

    /**
     * Intercepts standard inputs and evaluates text accuracy matrices
     */
    function processKeystrokeStream(e) {
        if (timeRemaining <= 0) return;

        // Fire metrics evaluation timeline loop on initial keystroke engagement
        if (!timerActive) {
            startTimerEngine();
        }

        const value = e.target.value;
        if (value.length === 0) return;

        const typedChar = value.slice(-1);
        e.target.value = ''; // Instantly wipe capture pool

        if (characterIndex >= sourceTextArray.length) return;

        const expectedChar = sourceTextArray[characterIndex];
        const spanNodes = textDisplay.querySelectorAll('.char');
        const targetSpan = spanNodes[characterIndex];

        totalKeystrokes++;

        if (typedChar === expectedChar) {
            targetSpan.classList.add('correct');
            targetSpan.classList.remove('incorrect');
        } else {
            errors++;
            targetSpan.classList.add('incorrect');
            targetSpan.classList.remove('correct');
        }

        characterIndex++;
        
        // Auto-wrap edge check if text bounds are reached prior to countdown termination
        if (characterIndex >= sourceTextArray.length) {
            evaluateFinalMetricsState();
            return;
        }

        updateCaretMarker();
        calculateInstantaneousMetrics();
    }

    /**
     * Isolates backspacing functions to roll back indices cleanly
     */
    function processSpecialKeys(e) {
        if (e.key === 'Backspace') {
            if (characterIndex > 0) {
                characterIndex--;
                const spanNodes = textDisplay.querySelectorAll('.char');
                const targetSpan = spanNodes[characterIndex];
                
                // Scrub historical tracking descriptors
                targetSpan.classList.remove('correct', 'incorrect');
                totalKeystrokes++; // Backspace acts as an analytical action
                
                updateCaretMarker();
                calculateInstantaneousMetrics();
            }
            e.preventDefault();
        }
    }

    /**
     * Orchestrates high-frequency system timer loop components
     */
    function startTimerEngine() {
        timerActive = true;
        const startTime = performance.now();
        const initialDuration = durationSetting;

        intervalEngine = setInterval(() => {
            const elapsed = (performance.now() - startTime) / 1000;
            timeRemaining = initialDuration - elapsed;

            if (timeRemaining <= 0) {
                timeRemaining = 0;
                evaluateFinalMetricsState();
            }

            updateDisplayMetrics();
            calculateInstantaneousMetrics();
        }, 100); // 100ms interval rate tracks crisp layout updates
    }

    /**
     * Executes typing metric mathematical models
     */
    function calculateInstantaneousMetrics() {
        if (totalKeystrokes === 0) return;

        const timeElapsedMinutes = (durationSetting - timeRemaining) / 60;
        
        // Default execution safety boundary check
        if (timeElapsedMinutes <= 0) return;

        // WPM Evaluation Formula Configuration
        const grossWPM = Math.round((totalKeystrokes / 5) / timeElapsedMinutes);
        
        // Accuracy Calculation Equations Matrix
        const accuracyPercentage = Math.max(0, Math.min(100, Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)));

        wpmDisplay.textContent = String(grossWPM).padStart(3, '0');
        accuracyDisplay.textContent = `${accuracyPercentage}%`;
        errorsDisplay.textContent = errors;
    }

    /**
     * Syncs visual metrics output layers with local variables
     */
    function updateDisplayMetrics() {
        timeDisplay.textContent = `${timeRemaining.toFixed(1)}s`;
    }

    /**
     * Resolves end-state criteria when countdown sequences reach zero
     */
    function evaluateFinalMetricsState() {
        clearInterval(intervalEngine);
        hiddenCatcher.disabled = true;
        timerActive = false;

        // Remove active caret visibility
        const spanNodes = textDisplay.querySelectorAll('.char');
        spanNodes.forEach(span => span.classList.remove('current'));

        // Compute absolute metrics parameters
        const timeElapsedMinutes = durationSetting / 60;
        const absoluteWPM = Math.round((totalKeystrokes / 5) / timeElapsedMinutes);
        
        if (absoluteWPM > highScore) {
            highScore = absoluteWPM;
            localStorage.setItem('velocity_high_score', highScore);
            highScoreDisplay.textContent = highScore;
        }

        // Display completion flag indicators inside system statuses
        const activeAccuracy = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100) : 0;
        textDisplay.innerHTML += `\n\n<div style="color: var(--caret-color); font-weight: 700; font-size: 1.15rem; background: rgba(59, 130, 246, 0.1); padding: 16px; border: 1px dashed var(--caret-color); border-radius: 8px; margin-top: 16px;">TEST COMPLETE // Metrics Solidified. WPM: ${absoluteWPM} | Accuracy: ${activeAccuracy}%</div>`;
    }

    // Trigger pipeline initialization
    initializeSuite();
});