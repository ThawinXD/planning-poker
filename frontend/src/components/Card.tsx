"use client";

export default function Card(
  { card, canVote, isSelected, onSelectCard }: { card: string; canVote: boolean; isSelected: boolean; onSelectCard: Function }
) {

  return (
    <div key={card} className={`w-16 h-24 flex items-center justify-center rounded-lg outline-2 outline-gray-400 relative
      ${canVote ? 'cursor-pointer rotate-y-0' : 'rotate-y-180'}
      ${isSelected ? 'scale-110 border-4 border-yellow-400' : ''}
      hover:scale-105 transform transition-all transform-3d`}
      onClick={() => onSelectCard()}>
      <div className="bg-white w-full h-full absolute top-0 left-0 flex items-center justify-center rounded-lg backface-hidden">
        <span className="text-2xl font-bold text-black">{card}</span>
      </div>
      <div className="bg-blue-500 backface-hidden w-full h-full absolute top-0 left-0 flex items-center justify-center rounded-lg rotate-y-180">

      </div>
    </div>
  )
}