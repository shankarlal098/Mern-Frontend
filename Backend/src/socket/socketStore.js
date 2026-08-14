const rooms = {};

const roomMessages = {};
const disconnectTimers = new Map;



function cleanupVoiceUser(io, socket, room) {
    if (!room || !rooms[room]) return;

    const roomData = rooms[room];

    if (!roomData.voiceUsers) return;

    const wasInVoice = roomData.voiceUsers.some(
        (user) => user.sessionId === socket.sessionId
    );

    // User voice chat me tha hi nahi
    if (!wasInVoice) return;

    // ============================================
    // REMOVE FROM VOICE USERS
    // ============================================

    roomData.voiceUsers =
        roomData.voiceUsers.filter(
            (user) =>
                user.sessionId !== socket.sessionId
        );

    // ============================================
    // TELL OTHER USERS TO CLEAN WEBRTC RESOURCES
    // ============================================

    socket.to(room).emit(
        "voice-user-left",
        {
            sessionId: socket.sessionId
        }
    );

    // ============================================
    // UPDATE VOICE USERS LIST
    // ============================================

    io.to(room).emit(
        "voice-users",
        {
            voiceUsers: roomData.voiceUsers,

            voiceActive:
                roomData.voiceUsers.length > 0
        }
    );
}




module.exports = {
  rooms,
  roomMessages,
  cleanupVoiceUser,
  disconnectTimers
};
