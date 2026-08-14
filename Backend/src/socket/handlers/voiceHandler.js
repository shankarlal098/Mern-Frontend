const {
    joinVoice,
    leaveVoice,
    voiceOffer,
    voiceAnswer,
    voiceIceCandidate,
    startVoice
} = require("../services/voiceService");

function registerVoiceHandlers(io, socket) {

    // =========================================
    // START VOICE
    // =========================================

    socket.on("voice-start", () => {

        console.log(
            "VOICE START EVENT RECEIVED"
        );

        startVoice(io, socket);

    });


    // =========================================
    // JOIN VOICE
    // =========================================

    socket.on("join-voice", () => {

        console.log(
            "JOIN VOICE EVENT RECEIVED"
        );

        joinVoice(io, socket);

    });


    // =========================================
    // LEAVE VOICE
    // =========================================

    socket.on("leave-voice", () => {

        console.log(
            "LEAVE VOICE EVENT RECEIVED"
        );

        leaveVoice(io, socket);

    });


    // =========================================
    // OFFER
    // =========================================

    socket.on("voice-offer", (payload) => {

        voiceOffer(
            io,
            socket,
            payload
        );

    });


    // =========================================
    // ANSWER
    // =========================================

    socket.on("voice-answer", (payload) => {

        voiceAnswer(
            io,
            socket,
            payload
        );

    });


    // =========================================
    // ICE CANDIDATE
    // =========================================

    socket.on(
        "voice-ice-candidate",
        (payload) => {

            voiceIceCandidate(
                io,
                socket,
                payload
            );

        }
    );

}

module.exports = registerVoiceHandlers;

module.exports = registerVoiceHandlers;

// backnee me kick , leave , disconnet ehandle karna baki 
// foenrend me lave , mute ko connet karn stream se baki hai 
// or start button ko handlekarna baki hia bs and vo race condtiojn bhi ..


