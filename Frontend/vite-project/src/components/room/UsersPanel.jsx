import { socket } from "../../socket/socket";

export default function UsersPanel({ users, typingUser, ownerId, onKick }) {
  return (
    <div className="w-full bg-base-200 border border-cyan-500 rounded-2xl p-5 h-fit shadow-xl">
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-cyan-400 mb-5">
        Online Users : {users.length}
      </h2>

      {/* USERS LIST */}
      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <div
            key={u.socketId}
            className="flex items-center justify-between bg-base-300 p-3 rounded-xl"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-3 h-3 rounded-full bg-green-500 shrink-0"></div>
              <p className="font-medium truncate">
                {u.username}
                {u.socketId === ownerId && (
                  <span className="text-cyan-400 ml-2 text-sm">• Host</span>
                )}
                {typingUser === u.socketId && (
                  <span className="text-xs text-cyan-400 ml-2">typing...</span>
                )}
              </p>
            </div>
            {/* KICK BUTTON */}
            {socket.id === ownerId && u.socketId !== ownerId && (
              <button
                onClick={() => onKick(u)}
                className="btn btn-xs btn-error shrink-0"
              >
                Kick
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}