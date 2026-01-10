import { Header } from "~/app/_components/header";
import { Hero } from "~/app/_components/sections/hero";
import { About } from "~/app/_components/sections/about";
import { Experience } from "~/app/_components/sections/experience";
import { Projects } from "~/app/_components/sections/projects";
import { Contact } from "~/app/_components/sections/contact";
import { Footer } from "~/app/_components/footer";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
				<About />
				<Experience />
				<Projects />
				<Contact />
			</main>
			<Footer />
		</>
	);
}
