import { useEffect, useState } from "react";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./Card";


export default function CardHolder(
  { cards, canVote, onSelectCard, showEditCards, updateCards }: { cards: string[]; canVote: boolean; onSelectCard: Function; showEditCards: boolean; updateCards?: Function }) {
  const [inCards, setCards] = useState<string[]>(cards);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    })
  );

  useEffect(() => {
    // console.log("Cards updated:");
    // console.log(inCards);
  }, [inCards]);

  useEffect(() => {
    if (!canVote) {
      setSelectedCard("");
    }
  }, [canVote]);

  // keep local cards in sync when parent prop changes
  useEffect(() => {
    // console.log("init cards", cards);
    setCards(cards);
  }, [cards]);

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) return;
    if (active.id === over.id) return;

    setCards((cards) => {
      const oldIndex = cards.indexOf(active.id as string);
      const newIndex = cards.indexOf(over.id as string);
      const newOrder = arrayMove(cards, oldIndex, newIndex);
      return newOrder;
    })
    setActiveId(null);
  }

  function addCard() {
    if (!showEditCards) return;
    let newCard = Math.floor(Math.random() * 100).toString();
    let counter = 0;
    while (inCards.includes(newCard)) {
      newCard = Math.floor(Math.random() * 100).toString();
      counter++;
      if (counter > 100) break;
    }
    if (counter > 100) newCard = `Card${inCards.length + 1}`;
    setCards(prev => [...prev, newCard]);
  }

  function deleteCard(card: string) {
    if (!showEditCards) return;
    setCards(prev => prev.filter(c => c !== card));
  }

  function onChangeTextCard(oldCard: string, newCard: string) {
    if (!showEditCards) return;
    setCards(prev => prev.map(c => c === oldCard ? newCard : c));
  }

  return (
    <div>
      {!showEditCards && !canVote && (
        <p className="text-center text-gray-400 mb-4">Wait for the host to start the voting.</p>
      )}
      {!showEditCards && canVote && (
        <p className="text-center text-gray-400 mb-4">Select a card to vote.</p>
      )}
      {showEditCards && (
        <p className="text-center text-gray-400 mb-4">Drag and drop cards to reorder them. Edit card number by clicking on text and typing. Click "+" to add a new card.</p>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={inCards}
          strategy={horizontalListSortingStrategy}
          disabled={!showEditCards}
        >
          <div className="flex flex-row flex-wrap gap-4 justify-center">
            {
              inCards.map((c) => (
                <Card
                  card={c}
                  key={inCards.indexOf(c)}
                  canVote={canVote}
                  onSelectCard={() => {
                    if (!canVote) return;
                    setSelectedCard(c);
                    onSelectCard(c);
                  }}
                  showEditCards={showEditCards}
                  onChangeTextCard={(newText: string) => onChangeTextCard(c, newText)}
                  deleteCard={() => deleteCard(c)}
                  isSelected={selectedCard === c}
                />
              ))
            }
            {showEditCards && (
              <div
                className="w-16 h-24 flex items-center justify-center rounded-lg outline-2 outline-green-400 outline-dashed relative hover:scale-105 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  addCard();
                }}
              >
                <span className="text-4xl text-green-400 select-none">+</span>
              </div>
            )}
            {showEditCards && (
              <div
                className="w-16 h-24 flex items-center justify-center rounded-lg outline-2 outline-white outline-dashed relative hover:scale-105 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setCards(cards);
                }}
              >
                <span className="text-4xl text-white select-none">↻</span>
              </div>
            )}
            {showEditCards && (
              <div
                className="w-16 h-24 flex items-center justify-center rounded-lg outline-2 outline-blue-500 outline-dashed relative hover:scale-105 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  updateCards && updateCards(inCards);
                }}
              >
                <span className="text-4xl text-blue-500 select-none">✓</span>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}