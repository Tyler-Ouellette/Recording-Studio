window.addEventListener("load", init);
const recording = [];


function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('playing');
}

function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const keycode = document.querySelector(`div[data-key="${e.keyCode}"]`);
    if (!audio) return;

    keycode.classList.add('playing');
    audio.currentTime = 0;
    audio.play();

    const timedNote = [];
    const key = e.key;
    const time = document.querySelector('.values').innerText;

    if (time === "00:00:00" || time === "00:00:00:0" || time === "00:00:00:00") return;

    timedNote.push(key, time);
    console.log(timedNote);

    recording.push(timedNote);
    console.log(recording);


}

function init() {
    const keys = Array.from(document.querySelectorAll('.key'));
    keys.forEach(key => key.addEventListener('transitionend', removeTransition));
    keys.forEach(key => key.addEventListener('keyup', removeTransition));
    window.addEventListener('keydown', playSound);

    var timer = new easytimer.Timer();

    $('.RecordingArea .startButton').click(function () {
        timer.start({
            precision: 'secondTenths'
        });
    });
    $('.RecordingArea .pauseButton').click(function () {
        timer.pause();
    });
    $('.RecordingArea .stopButton').click(function () {
        timer.stop();
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
        console.log(recording);
    });

    // console.log(recording);
}

// Will have to track Key Down and Key Up. Key down time and Key up of that same key time (Piano)s