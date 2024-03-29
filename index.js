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
    //     PlayBackTimer.start();
    //     PlayBackTimer.addEventListener('secondsUpdated', function (e) {
    //         $('.PlaybackTime').html(PlayBackTimer.getTimeValues().toString());
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

        const RecordingTimer = new easytimer.Timer();

        $('.RecordingArea .startButton').click(function () {
            window.removeEventListener('keydown', playSound);
            window.addEventListener('keydown', playAndRecord);
            RecordingTimer.start({
                precision: 'secondTenths'
            });
        });
        $('.RecordingArea .pauseButton').click(function () {
            RecordingTimer.pause();
            window.removeEventListener("keydown", playAndRecord);
            window.addEventListener("keydown", playSound);
        });
        $('.RecordingArea .endButton').click(function () {
            RecordingTimer.stop();
            window.removeEventListener("keydown", playAndRecord);
            window.addEventListener("keydown", playSound);
        });
        $('.RecordingArea .resetButton').click(function () {
            RecordingTimer.reset();
            RecordingTimer.stop();

        });
        RecordingTimer.addEventListener('secondsUpdated', function (e) {
            $('.RecordingArea .values').html(RecordingTimer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
        });
        RecordingTimer.addEventListener('secondTenthsUpdated', function (e) {
            $('.RecordingArea .values').html(RecordingTimer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
        });
        RecordingTimer.addEventListener('started', function (e) {
            $('.RecordingArea .values').html(RecordingTimer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
        });
        RecordingTimer.addEventListener('reset', function (e) {
            $('.RecordingArea .values').html(RecordingTimer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
            recording.splice(0, recording.length);
        });


        /**
         * Playback  Area
         */
        const PlayBackTimer = new easytimer.Timer();

        $('.playArea .PausePlayback').click(function () {
            PlayBackTimer.pause();
        });

        $('.playArea .RestartPlayback').click(function () {
            PlayBackTimer.reset();
            PlayBackTimer.stop();
        });

        PlayBackTimer.addEventListener('reset', function (e) {
            $('.RecordingArea .values').html(RecordingTimer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
        });

        $('.playArea .PlaybackRecording').click(function () {
            PlayBackTimer.start();
            PlayBackTimer.addEventListener('secondsUpdated', function (e) {
                $('.PlaybackTime').html(PlayBackTimer.getTimeValues().toString());
                // console.log(recording);
                recording.forEach(note => {
                    switch (note[0]) {
                        case "a":
                            sampler.triggerAttack("A3", note[1]);
                            break;
                        case "s":
                            sampler.triggerAttack("C3", note[1]);
                            break;
                        case "d":
                            sampler.triggerAttack("D3", note[1]);
                            break;
                        case "f":
                            sampler.triggerAttack("F3", note[1]);
                            break;
                        case "g":
                            sampler.triggerAttack("G3", note[1]);
                            break;
                        case "h":
                            sampler.triggerAttack("A4", note[1]);
                            break;
                        case "j":
                            sampler.triggerAttack("C4", note[1]);
                            break;
                        case "k":
                            sampler.triggerAttack("D4", note[1]);
                            break;
                        case "l":
                            sampler.triggerAttack("E4", note[1]);
                            break;
                        default:
                            break;
                    }
                });
            });
        });

        PlayBackTimer.addEventListener('reset', function (e) {
            $('.PlaybackTime').html(PlayBackTimer.getTimeValues().toString(['hours', 'minutes', 'seconds', 'secondTenths']));
        });


        /**
         * Tone.js section
         */



        const sampler = new Tone.Sampler({
                "A3": "sounds/clap.wav",
                "C3": "sounds/hihat.wav",
                "D3": "sounds/kick.wav",
                "F3": "sounds/openhat.wav",
                "G3": "sounds/boom.wav",
                "A4": "sounds/ride.wav",
                "C4": "sounds/snare.wav",
                "D4": "sounds/tom.wav",
                "E4": "sounds/tink.wav",
            },
            () => {
                // sampler.triggerAttack("A3");
                // // sampler.triggerAttack("C3");
                // // sampler.triggerAttack("D3");
                // // sampler.triggerAttack("F3");
                // // sampler.triggerAttack("G3");
                // // sampler.triggerAttack("A4");
                // // sampler.triggerAttack("C4");
                // // sampler.triggerAttack("D4");
                // // sampler.triggerAttack("E4");
            }
        ).toMaster();

        // document.querySelector("PlaybackRecording").addEventListener("click", () => {
        //     sampler.triggerAttack("a");
        // });

    }