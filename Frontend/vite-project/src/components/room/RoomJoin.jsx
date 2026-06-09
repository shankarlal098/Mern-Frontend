export default function RoomJoin({ room, setRoom, joinRoom, createRoom }) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="card w-full bg-base-200 shadow-2xl border border-cyan-500 p-2 md:p-4">
        <div className="card-body p-4 md:p-8">
          {/* TITLE */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-400">
            Join Code Room
          </h2>
          <p className="text-center text-gray-400 mb-4 text-sm md:text-base">
            Collaborate and code in realtime
          </p>
          
          {/* ROOM INPUT */}
          <input
            type="text"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="input input-bordered w-full mt-3 bg-base-300"
          />
          
          {/* BUTTONS */}
          <div className="flex flex-col gap-3 mt-5">
            <button
              onClick={joinRoom}
              className="btn btn-primary w-full"
            >
              Join Room
            </button>
            <button
              onClick={createRoom}
              className="btn btn-outline btn-info w-full"
            >
              Create Random Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}