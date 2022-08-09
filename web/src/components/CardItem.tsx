import Card from "../types/Card";

const typeColours = {
	categories: "#449e46",
	action: "#FFA500",
	death: "#000000",
	memory: "#0DA2FF",
	duel: "#FF0000",
	majority: "#937DC2",
};

const CardItem = ({ id, name, description, type }: Card) => {
	return (
		<div
			className="p-8 rounded m-4 w-[90%] max-w-[400px] shadow"
			style={{ backgroundColor: typeColours[type] }}
		>
			<h3 className="text-white text-3xl font-bold text-center">{name}</h3>
			<p className="text-white text-lg mt-4 text-center">{description}</p>
		</div>
	);
};

export default CardItem;
