import { useDrag, useDrop } from 'react-dnd';
import { useState } from 'react';
import { ItemTypes } from '../ItemTypes';
import { ReactComponent as AdressIcon } from '../../img/adressIcon.svg'
import './Card.scss'

export default function Card({ id, text, moveCard, findCard, deleteCard }) {
    const originalIndex = findCard(id).index;
    const [adress, setAdress] = useState('');
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.CARD,
        item: { id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const { id: droppedId, originalIndex } = item;
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveCard(droppedId, originalIndex);
            }
        },
    }), [id, originalIndex, moveCard]);
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findCard(id);
                moveCard(draggedId, overIndex);
            }
        },
    }), [findCard, moveCard]);
    const opacity = isDragging ? 0 : 1;
    function deleteClickHandler() {
        deleteCard(id)
    }
    async function fetchAdress() {
        const { card } = findCard(id);
        // console.log(card);
        let coords = card.placeMark.geometry.getCoordinates()
        let response = await fetch('https://geocode-maps.yandex.ru/1.x/?apikey=564bd91d-8029-4243-b5ac-6d1d436e2470&format=json&geocode=' + coords[1] + ',' + coords[0]);
        if (response.ok) {
            let json = await response.json();
            // console.log(json);
            return json.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text

        } else {
            // console.log(response.status);
            return 'адрес не определён'
        }

    }
    async function adressClickHandler() {
        let adress = await fetchAdress()
        setAdress(adress);
        setTimeout(() =>{setAdress('')},4000)
    }
    return (
        <div ref={(node) => drag(drop(node))} className={'card'} style={{ opacity }}>
            {adress?adress:text}
            <div className='card__buttons'>
                <button onClick={adressClickHandler} className="card__button">
                    <AdressIcon className='card__adressIcon' />
                </button>

                <button className="card__button" onClick={deleteClickHandler}>x</button>
            </div>

        </div>);
}
