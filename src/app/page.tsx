import { Footer } from "~/app/_components/footer";
import { Header } from "~/app/_components/header";
import { About } from "~/app/_components/sections/about";
import { BuildInfo } from "~/app/_components/sections/build-info";
import { Contact } from "~/app/_components/sections/contact";
import { Experience } from "~/app/_components/sections/experience";
import { Hero } from "~/app/_components/sections/hero";
import { Projects } from "~/app/_components/sections/projects";

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
				<BuildInfo />
			</main>
			<Footer />
		</>
	);
}
