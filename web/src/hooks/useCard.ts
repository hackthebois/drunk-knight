import axios from "axios";
import { useQuery } from "react-query";
import { CardSchema } from "../types/Card";

const getCardRequest = async () => {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/card`);
	const data: unknown = await res.data;
	const cards = await CardSchema.array().parse(data);

	return cards;
};

const useCard = () => {
	const getCard = useQuery("card", getCardRequest);

	return { getCard };
};

export default useCard;
