
export default function Player({name, isVoted, cardPicked, x, y}: {name: string; isVoted: boolean; cardPicked: string | null; x: number; y: number}) {
  return (
    <div
      className="absolute flex flex-col items-center transition-all duration-300"
      style={{
        transform: `translate(${x}px, ${y}px) translate(0%, 0%)`,
      }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center"
      >
        <img src="/avatar.svg" alt="Avatar" className="w-full h-full"/>
      </div>
      <p>{name}</p>
      {/* <p>{name} - {isVoted ? "Voted" : "Not Voted"} - {cardPicked || "No card picked"}</p> */}
    </div>
  )
}