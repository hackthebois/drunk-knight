import create from "zustand";
import { Deck } from "../types/Deck";

type DeckStore = {
	active: Deck[];
	decks: Deck[];
	activateDeck: (deck: Deck) => void;
	deactivateDeck: (deck: Deck) => void;
};

const useDeckStore = create<DeckStore>((set) => ({
	active: [],
	decks: [],
	activateDeck: (deck: Deck) =>
		set((state) => ({ ...state, active: [...state.active, deck] })),
	deactivateDeck: (deck: Deck) =>
		set((state) => ({ ...state, active: [...state.active, deck] })),
}));

export default useDeckStore;
