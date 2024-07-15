import { useState, useEffect } from 'react';
import dictionaryData from '../data';

export default function MainContent() {
    const [search, setSearch] = useState('');
    const [filteredDictionary, setFilteredDictionary] = useState([]);
    const [searched, setSearched] = useState(false);
    const [selectedWord, setSelectedWord] = useState(null);
    const [dictionaryByLetter, setDictionaryByLetter] = useState({});

    useEffect(() => {
        const dictionary = {};
        dictionaryData.forEach((item) => {
            const firstLetter = item.word.charAt(0).toLowerCase();
            if (!dictionary[firstLetter]) {
                dictionary[firstLetter] = [];
            }
            dictionary[firstLetter].push(item);
        });
        setDictionaryByLetter(dictionary);
    }, [dictionaryData]);

    const handleSearch = (term) => {
        const trimmedTerm = term.trim().toLowerCase();
        if (trimmedTerm === "") {
            setFilteredDictionary([]);
            setSearched(false);
            setSelectedWord(null);
            return;
        }
        const results = dictionaryData.filter(
            (item) => item.word.trim().toLowerCase().includes(trimmedTerm)
        );
        setFilteredDictionary(results);
        setSearched(true);
        if (results.length > 0) {
            setSelectedWord(results);
        } else {
            setSelectedWord(null);
        }
    };

    const handleLetterSelection = (letter) => {
        setSearch(letter);
        const filteredWords = dictionaryByLetter[letter.toLowerCase()] || [];
        setFilteredDictionary(filteredWords);
        setSelectedWord(null);
        if (filteredWords.length === 0) {
            setSearched(true);
        } else {
            setSearched(false);
        }
    };

    const handleWordSelection = (word) => {
        setSelectedWord(word);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch(search);
        }
    };

    let definitionComponent = null;
    if (selectedWord) {
        if (Array.isArray(selectedWord)) {
            definitionComponent = (
                <div className="multiple-definitions">
                    {selectedWord.map((word, index) => (
                        <div className="multiple-definition" key={index}>
                            <h2>{word.word}</h2>
                            <p>{word.definition}</p>
                        </div>
                    ))}
                </div>
            );
        } else {
            definitionComponent = (
                <div className="definition-container">
                    <h2>{selectedWord.word}</h2>
                    <p>{selectedWord.definition}</p>
                </div>
            );
        }
    }

    let resultsComponent = null;
    if (!selectedWord && filteredDictionary.length > 0) {
        resultsComponent = (
            <div className="results-container">
                {filteredDictionary.map((result, index) => (
                    <div className="result" key={index} onClick={() => handleWordSelection(result)}>
                        <h2>{result.word}</h2>
                    </div>
                ))}
            </div>
        );
    }

    let notFoundMessageElement = null;
    if (searched && filteredDictionary.length === 0) {
        notFoundMessageElement = (
            <h1 className="not-found">
                Не се најдени зборови!
            </h1>
        );
    }

    return (
        <main>
            <div className="search-container">
                <div className="input-container">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button onClick={() => handleSearch(search)}>Search</button>
                </div>
                {notFoundMessageElement}
            </div>
            <div className="inlineLetters">
                {Array.from("абвгдѓежзѕијклљмнњопрстќуфхцчџш").map((letter, index) => (
                    <h3 key={index} onClick={() => handleLetterSelection(letter)}>
                        {letter}
                    </h3>
                ))}
            </div>
            {definitionComponent}
            {resultsComponent}
        </main>
    );
}