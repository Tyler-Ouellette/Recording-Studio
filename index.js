window.addEventListener("load", init);
const recording = [];
const timeOfRelease = [];

// let lastKeyTime = Date.now(); To be used one day If piano is ever implemented. Nedd to track key downs and up



function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}

/**
 * This function is used to play the sound 
 */
function playSound(e) {

    if (e.repeat) return;

    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const keycode = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (!audio) return;

    keycode.classList.add('playing');
    audio.currentTime = 0;
    audio.play();

    // const currentKeyTime = Date.now();
    // console.log("First = " + currentKeyTime);
}

function playAndRecord(e) {
    if (e.repeat) return;

    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const keycode = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (!audio) return;

    keycode.classList.add('playing');
    audio.currentTime = 0;
    audio.play();

    const key = e.key;
    const startTime = document.querySelector('.values').innerText;

    // const currentKeyTime = Date.now();
    // console.log("First = " + currentKeyTime);
    recordNote(key, startTime);
}

function recordNote(key, startTime) {
    const timedNote = [];

    if (startTime === "00:00:00" || startTime === "00:00:00:0" || startTime === "00:00:00:00") return;
    timedNote.push(key, startTime);
    recording.push(timedNote);
    console.log(recording);
}

/**
 * This function will be used if I do a piano studio one day. Need to track the time of release as a piano note can be held.  
 * Drum Notes aren't really held down so that is not an issue.
 */
// function endSound(e) {
//     const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
//     if (!audio) return;

//     lastKeyTime = Date.now();
//     console.log("Last = " + lastKeyTime);

//     endTime = document.querySelector('.values').innerText;
//     if (endTime === "00:00:00" || endTime === "00:00:00:0" || endTime === "00:00:00:00") return;

//     const letter = this.childNodes[1].innerText.toLowerCase();
//     timeOfRelease.push(letter, endTime);
// }

// function playbackRecording() {
//     basicTimer.start();
//     basicTimer.addEventListener('secondsUpdated', function (e) {
//         $('.PlaybackTime').html(basicTimer.getTimeValues().toString());
//         console.log(recording);
//     });
// }

function init() {
    const keys = Array.from(document.querySelectorAll('.key'));
    keys.forEach(key => key.addEventListener('transitionend', removeTransition));
    // keys.forEach(key => key.addEventListener('keyup', removeTransition));
    window.addEventListener('keydown', playSound);
    // window.addEventListener('keyup', endSound);

    /**
     * Recording Area
     */

    const timer = new easytimer.Timer();

    $('.RecordingArea .startButton').click(function () {
        window.removeEventListener('keydown', playSound);
        window.addEventListener('keydown', playAndRecord);
        timer.start({
            precision: 'secondTenths'
        });
    });
    $('.RecordingArea .pauseButton').click(function () {
        timer.pause();
        window.removeEventListener("keydown", playAndRecord);
        window.addEventListener("keydown", playSound);
    });
    $('.RecordingArea .endButton').click(function () {
        timer.stop();
        recording.splice(0, recording.length);
        window.removeEventListener("keydown", playAndRecord);
        window.addEventListener("keydown", playSound);
    });
    $('.RecordingArea .resetButton').click(function () {
        timer.reset();
        timer.stop();

    });
    timer.addEventListener('secondsUpdated', function (e) {
        $('.RecordingArea .values').html(timer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
    });
    timer.addEventListener('secondTenthsUpdated', function (e) {
        $('.RecordingArea .values').html(timer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
    });
    timer.addEventListener('started', function (e) {
        $('.RecordingArea .values').html(timer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
    });
    timer.addEventListener('reset', function (e) {
        $('.RecordingArea .values').html(timer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
        recording.splice(0, recording.length);
    });


    /**
     * Playback  Area
     */
    const basicTimer = new easytimer.Timer();

    $('.playArea .PausePlayback').click(function () {
        basicTimer.pause();
    });

    $('.playArea .RestartPlayback').click(function () {
        basicTimer.reset();
        basicTimer.stop();
    });

    basicTimer.addEventListener('reset', function (e) {
        $('.RecordingArea .values').html(timer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
    });

    $('.playArea .PlaybackRecording').click(function () {
        basicTimer.start();
        basicTimer.addEventListener('secondsUpdated', function (e) {
            $('.PlaybackTime').html(basicTimer.getTimeValues().toString());
            console.log(recording);
        });
    });



}