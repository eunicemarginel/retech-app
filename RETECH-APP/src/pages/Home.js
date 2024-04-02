import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts';
// import ProductCard from '../components/ProductCard';

export default function Home() {
	
	const data = {
		title: "Zuitt Coding Bootcamp",
		content: "Opportunities for everyone, everywhere",
		destination: "/courses",
		label: "Enroll now!"
	}

	return (
		<>
			<Banner data={data}/>
			<FeaturedProducts/>
			<Highlights/>
		</>
	)
}