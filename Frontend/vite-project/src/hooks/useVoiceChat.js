import { useEffect, useRef, useState } from "react";

export default function useVoiceChat({
    socket,
    roomId,
    user,
    username,
    sessionId,
  
}) {

    const [voiceUsers, setVoiceUsers] = useState([]);
    const [voiceActive, setVoiceActive] = useState(false);
    const [connectionStates, setConnectionStates] = useState({});
    const [remoteStreamsState, setRemoteStreamsState] = useState({});
    const [isStarting, setIsStarting] = useState(false);
    // bhai rerender me fir se create nhi hoga ue ?? lost ho jaeyagi na imfo
    const peerConnections = useRef(new Map());
    const localStream = useRef(null);
    const remoteStreams = useRef(new Map());
    const [isMuted, setIsMuted] = useState(false);
    



    const leaveVoice = () => {

        // =========================================
        // 1. BACKEND KO BATAO
        // =========================================

        socket.emit("leave-voice", {

            room: roomId,

            sessionId

        });


        // =========================================
        // 2. CLOSE ALL WEBRTC CONNECTIONS
        // =========================================

        peerConnections.current.forEach((pc) => {

            pc.close();

        });

        peerConnections.current.clear();


        // =========================================
        // 3. CLEAR ALL REMOTE STREAMS
        // =========================================

        remoteStreams.current.clear();

        setRemoteStreamsState({});


        // =========================================
        // 4. CLEAR CONNECTION STATES
        // =========================================

        setConnectionStates({});


        // =========================================
        // 5. STOP LOCAL MICROPHONE
        // =========================================

        if (localStream.current) {

            localStream.current
                .getTracks()
                .forEach(track => {

                    track.stop();

                });

            localStream.current = null;

        }


        // =========================================
        // 6. RESET MUTE STATE
        // =========================================

        setIsMuted(false);

    };
    const toggleMute = () => {
        if (!localStream.current) return;
        localStream.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(prev => !prev);
    };
    const initializeLocalStream = async () => {

        if (localStream.current) {
            return localStream.current;
        }

        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
            localStream.current = stream;
            console.log("🎤 Local Stream Ready");
            return stream;
        }
        catch (error) {
            console.error(
                "Failed To Access Microphone :",
                error
            );
            throw error;
        }

    };
    const handleStartVoice = async () => {

    try {

        await initializeLocalStream();
        console.log("event succesfully fire bhai abhi to ")
        socket.emit("voice-start", {

            room: roomId,
            userId: user._id,
            username,
            sessionId

        });

    }
    catch (error) {
        console.log(error);
    }

    };
    const handleJoinVoice = async () => {

        try {

            await initializeLocalStream();

            socket.emit("join-voice", {

                room: roomId,
                userId: user._id,
                username,
                sessionId

            });

        }
        catch (error) {

            console.log(error);

        }

    };
    const createPeerConnection = (targetSessionId) => {

        if (peerConnections.current.has(targetSessionId)) {
            return peerConnections.current.get(targetSessionId);
        }

        const pc = new RTCPeerConnection({
            iceServers : [
                { urls: 'stun:global.stun.twilio.com:3478' },
                { 
                    urls: 'turn:global.turn.twilio.com:3478?transport=udp',
                    username: '9c62ac6db56ec83729d37f40bad08e21ac43f45d82e5b1ce9448298507b56ff0',  
                    credential: 'R9cxsrRCXGMNUCCMxRrg6J+FsrTovXGIfYXTQlczGxI=' 
                }
            ]
        });

        // =========================================
        // SEND LOCAL AUDIO
        // =========================================

        if (localStream.current) {

            localStream.current.getTracks().forEach(track => {

                pc.addTrack(track, localStream.current);

            });

        }

        // =========================================
        // RECEIVE REMOTE AUDIO
        // =========================================

        pc.ontrack = (event) => { // bhai ye baar baar chlega kya jitna baar samne wala user bolenga 
            const stream = event.streams[0];
            if (!stream) return;
            remoteStreams.current.set(
                targetSessionId,
                stream
            );
            setRemoteStreamsState(prev => ({
                ...prev,
                [targetSessionId]: stream
            }));
            console.log(
                "Remote stream received:",
                targetSessionId
            );
        };

        // =========================================
        // ICE CANDIDATE
        // =========================================

        pc.onicecandidate = (event) => {

            if (!event.candidate) return;

            if (event.candidate) {
                console.log(
                "ICE Candidate:",
                event.candidate.candidate
                );
            }
            socket.emit("voice-ice-candidate", {

                room: roomId,

                senderUserId: sessionId,

                targetSessionId,

                candidate: event.candidate

            });
        };

        // =========================================
        // CONNECTION STATE
        // =========================================
        pc.onconnectionstatechange = () => {

            const state = pc.connectionState;

            console.log(
                "Connection:",
                targetSessionId,
                state
            );

            setConnectionStates(prev => ({
                ...prev,
                [targetSessionId]: state // is this key value ?? pair 
            }));

        };
        // =========================================
        // ICE CONNECTION STATE
        // =========================================

        pc.oniceconnectionstatechange = () => {

            console.log(

                targetSessionId,

                pc.iceConnectionState

            );

        };
        peerConnections.current.set(
            targetSessionId,
            pc
        );

        return pc;

    };
    const createOffer   = async (targetSessionId) => {

        try {

            // Connection bnao
            const pc =
                createPeerConnection(targetSessionId);

            // SDP Offer
            const offer =
                await pc.createOffer();

            // Local Description set  means after seeting trigger the ice candidate gathering
            await pc.setLocalDescription( // will trigger the ice candidate gathering
                offer
            );

            // Backend ko bhejo
            socket.emit("voice-offer", {

                room: roomId,

                senderSessionId: sessionId,

                targetSessionId,

                offer

            });

        }
        catch (error) {

            console.log(error);

        }

    };
    const createAnswer  = async ({senderSessionId,offer}) => {
        try {
            // Connection bnao
            const pc =
                createPeerConnection(senderSessionId);
            
            // Remote SDP
            await pc.setRemoteDescription( //  received offer ko set krna
                new RTCSessionDescription(offer)
            );

            // Answer
            const answer =
                await pc.createAnswer();

            // Local SDP// after this the candiatdate gatherign is start
            await pc.setLocalDescription(answer);

            // Backend ko bhejo
            socket.emit("voice-answer", {

                room: roomId,

                senderSessionId: sessionId,

                targetSessionId: senderSessionId,

                answer

            });

        }
        catch (error) {

            console.log(error);

        }

    };
    const receiveAnswer = async ({senderSessionId, answer}) => {
        try {
            const pc =
                peerConnections.current.get(senderSessionId);
            if (!pc) return;
            await pc.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        }
        catch (error) {
          console.log(error);
        }
    };
    const receiveIceCandidate = async ({senderSessionId,candidate}) => {
        try {
            const pc =
                peerConnections.current.get(senderSessionId);
            if (!pc) return;
            await pc.addIceCandidate( // set candiates
                new RTCIceCandidate(candidate)
            );
        }
        catch (error) {
            console.log(error);
        }
    };
    const cleanupRemoteUser = (targetSessionId) => {

    // =========================================
    // 1. CLOSE PEER CONNECTION
    // =========================================

    const pc =
        peerConnections.current.get(targetSessionId);

    if (pc) {

        pc.close();

        peerConnections.current.delete(
            targetSessionId
        );

    }


    // =========================================
    // 2. REMOVE REMOTE STREAM
    // =========================================

    remoteStreams.current.delete(
        targetSessionId
    );


    // =========================================
    // 3. REMOVE CONNECTION STATE
    // =========================================

    setConnectionStates(prev => {

        const updated = { ...prev };

        delete updated[targetSessionId];

        return updated;

    });


    // =========================================
    // 4. REMOVE REACT REMOTE STREAM STATE
    // =========================================

    setRemoteStreamsState(prev => {

        const updated = { ...prev };

        delete updated[targetSessionId];

        return updated;

    });

    };
    function handleStartbutton() {
        if (isStarting || voiceActive) return;
        setIsStarting(true);
        // socket.emit("start-voice");
    }



    useEffect(() => { 
        const handleVoiceUsers = (payload) => { 
            console.log("MY SESSION:", sessionId);
            console.log(
                "VOICE USERS:",
                payload.voiceUsers
            );
            setVoiceUsers(payload.voiceUsers); 
            setVoiceActive(payload.voiceActive); 
        }; 
        const handleOfferNeeded = async ({ targetSessionId }) => {
            await createOffer(targetSessionId);
        };
        const handleVoiceOffer = async (payload) => {
            await createAnswer(payload);
        };
        const handleVoiceAnswer = async (payload) => {
            await receiveAnswer(payload);
        };
        const handleIceCandidate = async (payload) => {
            await receiveIceCandidate(payload);
        };
        const handleVoiceUserLeft = ({ sessionId: targetSessionId}) => {
            // Khud ka leave event ignore


            if (targetSessionId === sessionId) {
                return;
            }

            cleanupRemoteUser(targetSessionId);

        };

        socket.on("voice-user-left", handleVoiceUserLeft);
        socket.on("voice-ice-candidate", handleIceCandidate);
        socket.on("voice-answer", handleVoiceAnswer);
        socket.on("voice-offer",  handleVoiceOffer);
        socket.on("voice-users", handleVoiceUsers); 
        socket.on("voice-offer-needed", handleOfferNeeded);

        return () => { 
            socket.off("voice-users", handleVoiceUsers);
            socket.off("voice-offer-needed", handleOfferNeeded); 
            socket.off("voice-offer", handleVoiceOffer);
            socket.off("voice-answer", handleVoiceAnswer);
            socket.off("voice-ice-candidate", handleIceCandidate);
            socket.off("voice-user-left", handleVoiceUserLeft);
        };
    },[socket]);


    return {
        voiceUsers,
        voiceActive,
        connectionStates,
        handleStartVoice,
        handleJoinVoice,
        leaveVoice,
        toggleMute,
        peerConnections,
        localStream,
        remoteStreams,
        remoteStreamsState,
        isMuted,

        handleStartbutton,
        isStarting
        
    };
}





