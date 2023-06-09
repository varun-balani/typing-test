"use client";

import { useCallback, useEffect, useState } from 'react'

const isLetter = (str) => {
    if (str === "Space") return " ";
    if (str.length != 4) return false;
    if (str.substring(0, 3) === "Key") return str.substring(3, 4);
    return false;
}

export function TypingArea({ setTimer, text, setText, textToType, setTextToType, getRandomWords }) {
    const [currentLetter, setCurrentLetter] = useState(0);

    const resetBox = () => {
        const randomWords = getRandomWords();
        setTextToType(randomWords);
        setText(textToType.split("").map((letter) => ({ letter: letter, entered: "false" })));
        setCurrentLetter(0);
        setTimer(0);
    }

    const addLetter = (letter) => {
        letter = letter.toLowerCase();
        let correct = textToType[currentLetter] === letter;
        setText(text => text.map((data, index) => {
            if (index !== currentLetter) return data;
            return { letter: data.letter, entered: correct ? "correct" : "wrong" };
        }));
        setCurrentLetter(currentLetter + 1);
    }

    const deleteLetter = () => {
        if (currentLetter === 0) return;
        setText(text => text.map((data, index) => {
            if (index !== currentLetter - 1) return data;
            return { letter: data.letter, entered: "false" };
        }));
        setCurrentLetter(currentLetter - 1);
    }

    const keyDownHandler = useCallback((event) => {
        console.log(event.code);
        if (event.code === "Tab") {
            resetBox();
            event.preventDefault();
            return;
        }
        if (event.code === "Backspace") {
            deleteLetter();
            return;
        }
        if (event.code === "Space") {
            addLetter(" ");
            event.preventDefault();
            return;
        }
        let letter = isLetter(event.code);
        if (letter === false) return;
        addLetter(letter);
    });

    useEffect(() => {
        document.addEventListener("keydown", keyDownHandler);
        return () => document.removeEventListener("keydown", keyDownHandler);
    }, [keyDownHandler]);

    return (
        <div id="typing-area" className="w-full h-full bg-inherit text-lg sm:text-3xl sm:pl-20 sm:pr-20">
            {text.map((data, i) => {
                return <span key={i} className={(i === currentLetter ? "animate-blink border-l-2" : "border-l-2 border-gray-900") + " " + (data.letter === " " ? "ml-[0.3rem]" : "ml-[0.05rem]") + " box-border " + (data.entered === "false" ? "text-gray-700" : (data.entered === "wrong" ? "text-red-900" : "text-gray-300"))}>{data.letter}</span>
            })}
        </div>
    );
}