import React from 'react';
import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import Card from '../card/Card';
import update from 'immutability-helper';
import { ItemTypes } from '../ItemTypes';
import './List.scss';




const List =  React.memo( function List({cards, setCards, remoweMarker}) {
    const findCard = useCallback((id) => {
        const card = cards.filter((c) => `${c.id}` === id)[0];
        return {
            card,
            index: cards.indexOf(card),
        };
    }, [cards]);
    const moveCard = useCallback((id, atIndex) => {
        const { card, index } = findCard(id);
        setCards(update(cards, {
            $splice: [
                [index, 1],
                [atIndex, 0, card],
            ],
        }));
    }, [findCard, cards, setCards]);

    function handleDeleteCard(id){
        console.log(id,'id');
        const { card,index } = findCard(id);
        console.log(index);
        setCards(update(cards, {
            $splice: [
                [index, 1]
            ],
        }));
        remoweMarker(card.placeMark);
    }

    const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
    return (
        <div className="list"> 
            <div ref={drop} className='list__container'>
                {cards.map((card) => (<Card key={card.id} id={`${card.id}`} text={card.text} moveCard={moveCard} findCard={findCard} 
                deleteCard={handleDeleteCard}/>))}
            </div>
        </div>

    );
}
)
export default List;