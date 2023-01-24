import type { Card } from "../types/Card";

const typeColours = {
	CATEGORIES: "#449e46",
	ACTION: "#FFA500",
	MEMORY: "#0DA2FF",
	MAJORITY: "#937DC2",
};

const CardItem = ({ card }: { card?: Card }) => {
	if (!card) {
		return <div>Empty card</div>;
	}
	const { cardType, name, description } = card;

	return (
		<div className="w-full h-full text-text flex flex-col shadow">
			<div
				className="p-4 relative flex items-start justify-between rounded-t"
				style={{ backgroundColor: typeColours[cardType] }}
			>
				<div className="bg-white flex p-2 items-center rounded font-bold sm:text-xl sm:p-3">
					{cardType}
				</div>
			</div>
			<div className="bg-white p-4 sm:p-8 flex-1 rounded-b">
				<h3 className="text-2xl sm:text-4xl font-bold text-left break-words max-h-[65px] sm:min-h-[45px] sm:max-h-[80px] overflow-y-auto">
					{name}
				</h3>
				<p className="text-lg sm:text-2xl mt-4 text-left break-words flex-1 max-h-[110px] sm:max-h-[160px] overflow-y-auto">
					{description}
				</p>
			</div>
		</div>
	);
};

export default CardItem;
