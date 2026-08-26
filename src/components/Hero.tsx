
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">YOUR DIGITAL RECIPE BOOK</p>

        <h2>
          Discover your next
          <span>favorite bite.</span>
        </h2>

        <p className="hero-text">
          Explore delicious recipes, discover new dishes,
          and save the ones you love.
        </p>

        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search for a recipe, ingredient, cuisine..."
          />

          <button>Search</button>
        </div>
      </div>

      <div className="hero-decoration">
        <div className="rainbow-book">
          <div className="book-title">BiteBook</div>
          <div className="book-heart">♥</div>
        </div>

        <span className="food food-one">🍅</span>
        <span className="food food-two">🫑</span>
        <span className="food food-three">🧄</span>
        <span className="food food-four">🧅</span>
        <span className="food food-five">🌿</span>
      </div>
    </section>
  );
}

export default Hero;