type Card = {
	id: number;
	name: string;
	description: string;
	type: "categories" | "action" | "memory" | "duel" | "majority" | "death";
};

export default Card;
