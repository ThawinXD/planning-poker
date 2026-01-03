
export default function PlayerCard({x, y, isVoted, cardPicked}: {x: number; y: number; isVoted: boolean; cardPicked: string | null}) {

  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-300"
      style={{
        transform: `translate(${x}px, ${y}px) translate(0%, 0%)`,
      }}
    >
      <div
        className={`flex-none w-10 h-16 flex items-center justify-center rounded-lg outline-2 outline-gray-400 relative
        ${isVoted ? 'opacity-100' : 'opacity-0'}
        ${cardPicked ? 'rotate-y-180' : 'rotate-y-0'}
        transform transition-all transform-3d duration-300`}
      >
        <div className="bg-blue-500 w-full h-full absolute top-0 left-0 flex items-center justify-center rounded-lg backface-hidden">
        </div>
        <div className="bg-white backface-hidden w-full h-full absolute top-0 left-0 flex items-center justify-center rounded-lg rotate-y-180">
          <span className="text-2xl font-bold text-black">{cardPicked}</span>
        </div>
      </div>
    </div>
  )
}