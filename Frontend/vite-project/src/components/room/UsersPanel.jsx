import React from "react";

export default function UsersPanel({
  users,
  typingUser,
  ownerUserId,
  myRole,
  currentUserId,
  onKick,
}) {
  const onlineUsers = users.filter((user) => user.online).length;

  return (
    <div className="w-full rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg">
      {/* Header */}
      <div className="border-b border-[#30363d] px-5 py-4">
        <h2 className="text-lg font-semibold text-white">
          Users
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          {onlineUsers} Online • {users.length} Total
        </p>
      </div>

      {/* Users */}
      <div className="max-h-[420px] overflow-y-auto p-4 space-y-3">

        {users.map((u) => (
          <div
            key={u.userId}
            className="flex items-center justify-between rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 transition-all duration-200 hover:border-[#58a6ff] hover:bg-[#161b22]"
          >
            <div className="flex items-center gap-3 overflow-hidden">

              {/* Status Dot */}
              <span
                className={`h-3 w-3 rounded-full shrink-0 ${
                  u.online
                    ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
                    : "bg-gray-600"
                }`}
              />

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="truncate font-medium text-gray-100">
                    {u.username}
                  </span>

                  {u.userId?.toString() === ownerUserId?.toString() && (
                    <span className="rounded bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-300">
                      👑 Host
                    </span>
                  )}

                  {u.role === "editor" &&
                    u.userId?.toString() !== ownerUserId?.toString() && (
                      <span className="rounded bg-blue-500/15 px-2 py-0.5 text-xs text-blue-300">
                        ✏ Editor
                      </span>
                    )}

                  {u.role === "viewer" && (
                    <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                      👁 Viewer
                    </span>
                  )}
                </div>

                {typingUser === u.username && (
                  <p className="mt-1 text-xs text-green-400 animate-pulse">
                    typing...
                  </p>
                )}

                {!u.online && (
                  <p className="mt-1 text-xs text-gray-500">
                    Offline
                  </p>
                )}
              </div>
            </div>

            {myRole === "admin" &&
              u.userId !== currentUserId &&
              u.online && (
                <button
                  onClick={() => onKick(u)}
                  className="rounded-md border border-red-500 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500 hover:text-white"
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