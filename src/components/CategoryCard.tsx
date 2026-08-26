type CategoryCardProps = {
	emoji: string;
	name: string;
	colorClass: string;
};

function CategoryCard({ emoji, name, colorClass }: CategoryCardProps) {
	return (
		<article className={`category-card ${colorClass}`}>
			<span className="category-emoji" aria-hidden="true">
				{emoji}
			</span>
			<h4>{name}</h4>
		</article>
	);
}

export default CategoryCard;
