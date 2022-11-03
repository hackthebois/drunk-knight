/** @type {import('tailwindcss').Config} */

module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#AE76A6",
				background: "#15202B",
				lightbackground: "#1B2835",
				text: "#333333",
				border: "#777",
			},
			fontFamily: {
				default: ["Open Sans", "Verdana", "sans-serif"],
			},
		},
	},
	plugins: [],
};
