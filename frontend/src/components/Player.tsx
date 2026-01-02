
export default function Player({name, isVoted, cardPicked, x, y}: {name: string; isVoted: boolean; cardPicked: string | null; x: number; y: number}) {
  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-300"
      style={{
        transform: `translate(${x}px, ${y}px) translate(0%, 10%)`,
      }}
    >
      <div
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
      >
      </div>
      <p>{name}</p>
      {/* <p>{name} - {isVoted ? "Voted" : "Not Voted"} - {cardPicked || "No card picked"}</p> */}
    </div>
  )
}