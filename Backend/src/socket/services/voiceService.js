const { rooms } = require("../socketStore");

// ============================================
// JOIN VOICE
// ============================================

function joinVoice(io, socket) {

    const room = socket.room;

    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    if (!roomData.voiceUsers) {
        roomData.voiceUsers = [];
    }

    // =========================================
    // FIND CURRENT SESSION
    // =========================================

    const currentUser =
        roomData.users.find(
            user =>
                user.sessionId === socket.sessionId
        );

    if (!currentUser) return;

    // =========================================
    // PREVENT DUPLICATE JOIN
    // =========================================

    const alreadyJoined =
        roomData.voiceUsers.some(
            user =>
                user.sessionId === socket.sessionId
        );

    if (alreadyJoined) return;

    // =========================================
    // ADD TO VOICE
    // =========================================

    roomData.voiceUsers.push({

        socketId: socket.id,

        userId: currentUser.userId,

        sessionId: currentUser.sessionId,

        username: currentUser.username

    });

    // =========================================
    // EXISTING USERS CREATE OFFER
    // =========================================

    roomData.voiceUsers.forEach(user => {

        if (
            user.sessionId === currentUser.sessionId
        ) {
            return;
        }

        io.to(user.socketId).emit(
            "voice-offer-needed",
            {
                targetSessionId:
                    currentUser.sessionId
            }
        );

    });

    // =========================================
    // UPDATE EVERYONE
    // =========================================

    io.to(room).emit(
        "voice-users",
        {
            voiceUsers: roomData.voiceUsers,

            voiceActive:
                roomData.voiceUsers.length > 0
        }
    );
}


// ============================================
// START VOICE
// ============================================

function startVoice(io, socket) {
    console.log("Backend done");
    const room = socket.room;

    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    console.log(roomData);

    if (!roomData.voiceUsers) {
        roomData.voiceUsers = [];
    }

    // =========================================
    // VOICE ALREADY ACTIVE
    // =========================================

    if (roomData.voiceUsers.length > 0) {

        // Treat this request as a normal join
        joinVoice(io, socket);

        return;
    }

    // =========================================
    // FIRST USER STARTS VOICE
    // =========================================

    const currentUser =
        roomData.users.find(
            user =>
                user.sessionId === socket.sessionId
        );

    if (!currentUser) return;

    roomData.voiceUsers.push({

        socketId: socket.id,

        userId: currentUser.userId,

        sessionId: currentUser.sessionId,

        username: currentUser.username

    });

    // =========================================
    // VOICE IS NOW ACTIVE
    // =========================================

    io.to(room).emit(
        "voice-users",
        {
            voiceUsers: roomData.voiceUsers,

            voiceActive: true
        }
    );

    console.log("Backend done");
}


// ============================================
// LEAVE VOICE
// ============================================

function leaveVoice(io, socket) {

    const room = socket.room;

    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    if (!roomData.voiceUsers) return;

    const wasInVoice =
        roomData.voiceUsers.some(
            user =>
                user.sessionId === socket.sessionId
        );

    if (!wasInVoice) return;

    // =========================================
    // REMOVE CURRENT SESSION
    // =========================================

    roomData.voiceUsers =
        roomData.voiceUsers.filter(
            user =>
                user.sessionId !== socket.sessionId
        );

    // =========================================
    // TELL OTHER CLIENTS
    // =========================================

    socket.to(room).emit(
        "voice-user-left",
        {
            sessionId: socket.sessionId
        }
    );

    // =========================================
    // UPDATED VOICE STATE
    // =========================================

    io.to(room).emit(
        "voice-users",
        {
            voiceUsers: roomData.voiceUsers,

            voiceActive:
                roomData.voiceUsers.length > 0
        }
    );
}


// ============================================
// OFFER
// ============================================

function voiceOffer(io, socket, payload) {

    const {
        targetSessionId,
        offer
    } = payload;

    const room = socket.room;

    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    const receiver =
        roomData.voiceUsers.find(
            user =>
                user.sessionId === targetSessionId
        );

    if (!receiver) return;

    io.to(receiver.socketId).emit(
        "voice-offer",
        {
            senderSessionId:
                socket.sessionId,

            offer
        }
    );
}


// ============================================
// ANSWER
// ============================================

function voiceAnswer(io, socket, payload) {

    const {
        targetSessionId,
        answer
    } = payload;

    const room = socket.room;

    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    const receiver =
        roomData.voiceUsers.find(
            user =>
                user.sessionId === targetSessionId
        );

    if (!receiver) return;

    io.to(receiver.socketId).emit(
        "voice-answer",
        {
            senderSessionId:
                socket.sessionId,

            answer
        }
    );
}


// ============================================
// ICE CANDIDATE
// ============================================

function voiceIceCandidate(io, socket, payload) {

    const {
        targetSessionId,
        candidate
    } = payload;

    const room = socket.room;

    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    const receiver =
        roomData.voiceUsers.find(
            user =>
                user.sessionId === targetSessionId
        );

    if (!receiver) return;

    io.to(receiver.socketId).emit(
        "voice-ice-candidate",
        {
            senderSessionId:
                socket.sessionId,

            candidate
        }
    );
}


// ============================================
// EXPORTS
// ============================================

module.exports = {

    startVoice,

    joinVoice,

    leaveVoice,

    voiceOffer,

    voiceAnswer,

    voiceIceCandidate

};


// Start with these doubts 
// ha pehle iski need btana why this kiyu jarurrat hai iski usse pehle kuch doubt 

// pehle abhi tk hmne jo remote data aa rha and jo local wala data hai ussko reacrt seconnete nhi kiya i,e ui alaos 
// doobt 2 
//     const peerConnections = useRef(new Map());
//     const localStream = useRef(null);
//     const remoteStreams = useRef(new Map());  ye presisite kese hoge bhai rerender me fir se creatre hoga fir daat presistance alos what if referssh mere hisab se referseh se sahi hoga kiyuki refersh me reconneticvity se room to handle ho jayega but rtc breke ho jaeyaga so sahi hai mere hisab se ???  or ek doubt referseh se web rtc pura disconneted hoga na ??  mean direct user only see join page ?? 
// doubt 3,...bhai ye serlocaldiscrition kiyu karte hai taki pta rhe kikonsa protocol use kr rhe or kya ans tha ?? and alos for ice ko gathring candiate ko trigger karne ke liya  ,,  pehle ye sab clear kr fir icee queuie pe chlte hai 

// or ek or abhi tk hmne sirf user join pe click karga to kya hoga usko hi handle kiya hai abhi ye bhi discuss karnahai ki first user kese joinn hoga mtlb start button wala ?? mean what if user click on start button .. ye karte hai sare eke ek karke reoslve doubt ok   bhai 

// and conplete the websoket bhai 