export function cn(...inputs: (string | undefined | null | false | { [key: string]: boolean })[]) {
	return inputs
		.filter(Boolean)
		.map((input) => {
			if (typeof input === "string") return input;
			if (typeof input === "object" && input !== null) {
				return Object.entries(input)
					.filter(([_, value]) => Boolean(value))
					.map(([key]) => key)
					.join(" ");
			}
			return "";
		})
		.join(" ")
		.trim();
}
