export default function RoomJoin({
  room,
  setRoom,
  joinRoom,
  createRoom
}) {
  return (
    <div className="rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">

      <div className="p-8">

        {/* Title */}

        <h2 className="text-3xl font-bold text-white text-center">
          Join a Room
        </h2>

        <p className="mt-2 text-center text-[#8b949e]">
          Enter an existing room ID or create a new one.
        </p>

        {/* Input */}

        <div className="mt-8">

          <label className="mb-2 block text-sm font-medium text-[#c9d1d9]">
            Room ID
          </label>

          <input
            type="text"
            placeholder="example : x82jd1"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-[#30363d]
              bg-[#0d1117]
              px-4
              py-3
              text-white
              placeholder:text-[#6e7681]
              outline-none
              transition
              focus:border-[#58a6ff]
            "
          />

        </div>

        {/* Buttons */}

        <div className="mt-8 flex flex-col gap-4">

          <button
            onClick={joinRoom}
            className="
              rounded-lg
              bg-[#238636]
              px-4
              py-3
              font-semibold
              text-white
              transition
              hover:bg-[#2ea043]
            "
          >
            Join Room
          </button>

          <button
            onClick={createRoom}
            className="
              rounded-lg
              border
              border-[#30363d]
              bg-[#21262d]
              px-4
              py-3
              font-semibold
              text-[#c9d1d9]
              transition
              hover:bg-[#30363d]
            "
          >
            Create Random Room
          </button>

        </div>

      </div>

    </div>
  );
}