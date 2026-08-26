type RecipeCardProps = {
  name: string;
  emoji: string;
  rating: number;
  time: number;
  imageClass: string;
};

function RecipeCard({
  name,
  emoji,
  rating,
  time,
  imageClass,
}: RecipeCardProps) {
  return (
    <div className="recipe-card">
      <div className={`recipe-image ${imageClass}`}>
        {emoji}

        <button className="favorite" aria-label={`Favorite ${name}`}>
          ♡
        </button>
      </div>

      <div className="recipe-info">
        <h4>{name}</h4>
        <p>
          ⭐ {rating} &nbsp; ◷ {time} min
        </p>
      </div>
    </div>
  );
}

export default RecipeCard;