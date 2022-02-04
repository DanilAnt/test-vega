import React from 'react';
import List from '../list/List'
import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper';
import uniqid from 'uniqid';
import './Container.scss';
import Map from '../map/Map';


export default function Container() {

    const [myMap, setMap] = useState('')
    const [newPoint, setNewPoint] = useState('')
    const [cards, setCards] = useState([]);
    const [polyline, setPolyline] = useState();
    const ymaps = window.ymaps;
    function handler(e) {
        if (e.code === 'Enter') enterHandler()
    }
    useEffect(() => {
        // initiate the event handler
        document.addEventListener('keyup', handler)
        // this will clean up the event every time the component is re-rendered
        return function cleanup() {
            document.removeEventListener('keyup', handler)
        }
    })
    useEffect(() => { makePolyline(); updatePlaceMarkEvents() }, [cards])
    function inputHandler(e) {
        setNewPoint(e.target.value);
    }

    function enterHandler() {
        // console.log('enterHandler');
        if (newPoint.trim().length > 0) {
            addNewCard();
            setNewPoint('')
        }
        // console.log(cards);
    }

    function addNewCard() {
        if (myMap) {
            let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="margin: 3px;">' +
                    '<p>{{properties.name}}</p>' +
                '</div>');
            let placeMark = new ymaps.Placemark(myMap.getCenter(), {name:newPoint}, {balloonContentLayout: BalloonContentLayout,
                draggable: true
            });


            let card = {
                id: uniqid(),
                text: newPoint,
                placeMark,
            }
            setCards([...cards, card]);
            myMap.geoObjects.add(placeMark);
        }
    }
    function updatePlaceMarkEvents() {
        cards.forEach(card => { card.placeMark.geometry.events.add('change', makePolyline) })
    }
    function remoweMarkerHandler(placeMark){
        myMap.geoObjects.remove(placeMark);
        makePolyline();
    }
    function makePolyline() {
        if (myMap) {
            // myMap.geoObjects.each((e) => { console.log(e) });
            let coords = cards.map((card) => { return card.placeMark.geometry.getCoordinates() })
            // console.log(cards);
            // console.log(polyline, 10);
            if (polyline) {
                coords.forEach((c, index) => {
                    // console.log(c,'c');
                    polyline.geometry.set(index, c);
                })
                polyline.geometry.set(coords.length, []);
            }
        }
    }
    return (
        <div className='container'>
            <div className='container__list'>
                <input placeholder="введите новую точку" value={newPoint} onChange={(e) => { inputHandler(e) }} type="text" />

                <DndProvider backend={HTML5Backend}>
                    <List remoweMarker={remoweMarkerHandler} cards={cards} setCards={setCards} />
                </DndProvider>
            </div>

            <Map ymaps={ymaps} setMap={setMap} myMap={myMap} polyline={polyline} setPolyline={setPolyline} />
        </div>
    )
}
