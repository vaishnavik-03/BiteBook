import { useEffect, useState } from "react";
import "./App.css";
import {
  getPopularRecipes,
  getRecipeById,
  getRecipesByCategory,
  getRecipesByCuisine,
  searchRecipes,
  type Recipe,
} from "./services/recipeApi";

const categories = [
  {
    name: "Chicken",
    subtitle: "Tender & tasty",
    emoji: "🍗",
    className: "chicken",
  },
  {
    name: "Pasta",
    subtitle: "Comfort food",
    emoji: "🍝",
    className: "pasta",
  },
  {
    name: "Vegetarian",
    subtitle: "Fresh & healthy",
    emoji: "🥬",
    className: "vegetarian",
  },
  {
    name: "Dessert",
    subtitle: "Sweet treats",
    emoji: "🧁",
    className: "dessert",
  },
  {
    name: "Seafood",
    subtitle: "Fresh from sea",
    emoji: "🐟",
    className: "seafood",
  },
];

const cuisines = [
  {
    name: "Indian",
    emoji: "🇮🇳",
    className: "cuisine-indian",
  },
  {
    name: "Italian",
    emoji: "🇮🇹",
    className: "cuisine-italian",
  },
  {
    name: "Mexican",
    emoji: "🇲🇽",
    className: "cuisine-mexican",
  },
  {
    name: "Japanese",
    emoji: "🇯🇵",
    className: "cuisine-japanese",
  },
  {
    name: "Thai",
    emoji: "🇹🇭",
    className: "cuisine-thai",
  },
  {
    name: "Greek",
    emoji: "🇬🇷",
    className: "cuisine-greek",
  },
];

function App() {
  const [searchQuery, setSearchQuery] =
    useState("");

  const [recipes, setRecipes] =
    useState<Recipe[]>([]);

  const [popularRecipes, setPopularRecipes] =
    useState<Recipe[]>([]);

  const [favorites, setFavorites] =
    useState<Recipe[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [popularLoading, setPopularLoading] =
    useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [resultsTitle, setResultsTitle] =
    useState("");

  const [selectedRecipe, setSelectedRecipe] =
    useState<Recipe | null>(null);

  /* =========================
     LOAD FAVORITES
  ========================= */

  useEffect(() => {
    const savedFavorites =
      localStorage.getItem(
        "bitebook-favorites",
      );

    if (!savedFavorites) {
      return;
    }

    try {
      const parsedFavorites =
        JSON.parse(savedFavorites);

      if (Array.isArray(parsedFavorites)) {
        setFavorites(parsedFavorites);
      }
    } catch {
      localStorage.removeItem(
        "bitebook-favorites",
      );
    }
  }, []);

  /* =========================
     SAVE FAVORITES
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "bitebook-favorites",
      JSON.stringify(favorites),
    );
  }, [favorites]);

  /* =========================
     POPULAR RECIPES
  ========================= */

  useEffect(() => {
    async function loadPopularRecipes() {
      try {
        const results =
          await getPopularRecipes();

        setPopularRecipes(
          results.slice(0, 6),
        );
      } catch {
        setPopularRecipes([]);
      } finally {
        setPopularLoading(false);
      }
    }

    loadPopularRecipes();
  }, []);

  /* =========================
     SEARCH
  ========================= */

  async function handleSearch() {
    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    setLoading(true);
    setError("");
    setSelectedRecipe(null);

    setResultsTitle(
      `Recipes for "${query}"`,
    );

    try {
      const results =
        await searchRecipes(query);

      setRecipes(results);

      if (results.length === 0) {
        setError(
          `No recipes found for "${query}".`,
        );
      }

      setTimeout(() => {
        document
          .getElementById(
            "search-results",
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch {
      setRecipes([]);

      setError(
        "Something went wrong while fetching recipes.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     CATEGORY
  ========================= */

  async function handleCategoryClick(
    category: string,
  ) {
    setSearchQuery(category);
    setLoading(true);
    setError("");
    setSelectedRecipe(null);

    setResultsTitle(
      `${category} Recipes`,
    );

    try {
      const results =
        await getRecipesByCategory(
          category,
        );

      setRecipes(results);

      if (results.length === 0) {
        setError(
          `No recipes found in the ${category} category.`,
        );
      }

      setTimeout(() => {
        document
          .getElementById(
            "search-results",
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch {
      setRecipes([]);

      setError(
        "Something went wrong while fetching recipes.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     CUISINE
  ========================= */

  async function handleCuisineClick(
    cuisine: string,
  ) {
    setSearchQuery(cuisine);
    setLoading(true);
    setError("");
    setSelectedRecipe(null);

    setResultsTitle(
      `${cuisine} Recipes`,
    );

    try {
      const results =
        await getRecipesByCuisine(
          cuisine,
        );

      setRecipes(results);

      if (results.length === 0) {
        setError(
          `No ${cuisine} recipes found.`,
        );
      }

      setTimeout(() => {
        document
          .getElementById(
            "search-results",
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch {
      setRecipes([]);

      setError(
        `Unable to load ${cuisine} recipes.`,
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     RECIPE DETAILS
  ========================= */

  async function handleRecipeClick(
    recipeId: string,
  ) {
    if (!recipeId) {
      return;
    }

    setDetailsLoading(true);
    setError("");

    try {
      const recipe =
        await getRecipeById(
          recipeId,
        );

      if (!recipe) {
        setError(
          "Recipe details could not be found.",
        );

        return;
      }

      setSelectedRecipe(recipe);

      setTimeout(() => {
        document
          .getElementById(
            "recipe-details",
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } catch {
      setError(
        "Unable to load recipe details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  /* =========================
     FAVORITES
  ========================= */

  function toggleFavorite(
    recipe: Recipe,
  ) {
    setFavorites(
      (currentFavorites) => {
        const alreadyFavorite =
          currentFavorites.some(
            (favorite) =>
              favorite.idMeal ===
              recipe.idMeal,
          );

        if (alreadyFavorite) {
          return currentFavorites.filter(
            (favorite) =>
              favorite.idMeal !==
              recipe.idMeal,
          );
        }

        return [
          ...currentFavorites,
          recipe,
        ];
      },
    );
  }

  function isFavorite(
    recipeId: string,
  ) {
    return favorites.some(
      (favorite) =>
        favorite.idMeal ===
        recipeId,
    );
  }

  /* =========================
     KEYBOARD SEARCH
  ========================= */

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  /* =========================
     INGREDIENTS
  ========================= */

  function getIngredients(
    recipe: Recipe,
  ) {
    const ingredients: string[] =
      [];

    for (let i = 1; i <= 20; i++) {
      const ingredient =
        recipe[
          `strIngredient${i}`
        ];

      const measure =
        recipe[
          `strMeasure${i}`
        ];

      if (
        ingredient &&
        ingredient.trim()
      ) {
        ingredients.push(
          `${measure?.trim() || ""} ${ingredient.trim()}`.trim(),
        );
      }
    }

    return ingredients;
  }

  /* =========================
     RECIPE CARD
  ========================= */

  function RecipeCard({
    recipe,
  }: {
    recipe: Recipe;
  }) {
    const favorite =
      isFavorite(recipe.idMeal);

    return (
      <article
        className="recipe-card"
        onClick={() =>
          handleRecipeClick(
            recipe.idMeal,
          )
        }
      >
        <div className="recipe-image">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
          />

          <button
            className={`favorite-button ${
              favorite
                ? "favorite-active"
                : ""
            }`}
            aria-label={
              favorite
                ? `Remove ${recipe.strMeal} from favorites`
                : `Save ${recipe.strMeal}`
            }
            onClick={(event) => {
              event.stopPropagation();

              toggleFavorite(
                recipe,
              );
            }}
          >
            {favorite ? "♥" : "♡"}
          </button>
        </div>

        <div className="recipe-info">
          <h3>
            {recipe.strMeal}
          </h3>

          <div className="recipe-meta">
            {recipe.strCategory && (
              <span>
                {recipe.strCategory}
              </span>
            )}

            {recipe.strArea && (
              <span>
                🌎 {recipe.strArea}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="app">
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <a
          className="logo"
          href="#home"
        >
          Bite<span>Book</span>
        </a>

        <nav>
          <a
            className="active"
            href="#home"
          >
            Home
          </a>

          <a href="#categories">
            Categories
          </a>

          <a href="#cuisines">
            Cuisines
          </a>

          <a href="#recipes">
            Recipes
          </a>

          <a href="#favorites">
            ♡ Favorites
          </a>
        </nav>

        <button className="sign-in">
          Sign in
        </button>
      </header>

      <main>
        {/* =========================
            HERO
        ========================= */}

        <section
          className="hero"
          id="home"
        >
          <div className="hero-content">
            <p className="eyebrow">
              YOUR DIGITAL RECIPE BOOK
            </p>

            <h1>
              Discover your next
              <span>
                favorite bite.
              </span>
            </h1>

            <p className="hero-description">
              Explore delicious
              recipes, discover new
              dishes, and save the ones
              you love.
            </p>

            <div className="search-box">
              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Search for a recipe, ingredient, cuisine..."
              />

              <button
                className="search-button"
                onClick={
                  handleSearch
                }
                disabled={loading}
              >
                {loading
                  ? "Searching..."
                  : "Search"}
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-shape shape-one" />
            <div className="floating-shape shape-two" />
            <div className="floating-shape shape-three" />

            <div className="book">
              <div className="book-cover">
                <span>
                  BiteBook
                </span>

                <strong>
                  ♥
                </strong>
              </div>

              <div className="book-pages" />
            </div>

            <div className="food-photo tomato">
              <img
                src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=300&q=80"
                alt="Fresh tomatoes"
              />
            </div>

            <div className="food-photo pepper">
              <img
                src="https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=300&q=80"
                alt="Bell pepper"
              />
            </div>

            <span className="floating-food basil">
              🌿
            </span>

            <span className="floating-food garlic">
              🧄
            </span>
          </div>
        </section>

        {/* =========================
            SEARCH RESULTS
        ========================= */}

        {(loading ||
          recipes.length > 0 ||
          error) && (
          <section
            className="section search-results-section"
            id="search-results"
          >
            <div className="section-heading">
              <div>
                <p className="section-label rainbow-label">
                  SEARCH RESULTS
                </p>

                <h2>
                  {resultsTitle}
                </h2>
              </div>
            </div>

            {loading && (
              <div className="loading-message">
                <div className="loader" />

                <p>
                  Finding delicious
                  recipes...
                </p>
              </div>
            )}

            {!loading &&
              error && (
                <div className="error-message">
                  <span>
                    🍽️
                  </span>

                  <p>{error}</p>
                </div>
              )}

            {!loading &&
              recipes.length > 0 && (
                <div className="recipe-grid">
                  {recipes.map(
                    (recipe) => (
                      <RecipeCard
                        key={
                          recipe.idMeal
                        }
                        recipe={
                          recipe
                        }
                      />
                    ),
                  )}
                </div>
              )}
          </section>
        )}

        {/* =========================
            RECIPE DETAILS LOADING
        ========================= */}

        {detailsLoading && (
          <section className="section">
            <div className="loading-message">
              <div className="loader" />

              <p>
                Loading recipe
                details...
              </p>
            </div>
          </section>
        )}

        {/* =========================
            RECIPE DETAILS
        ========================= */}

        {selectedRecipe &&
          !detailsLoading && (
            <section
              className="section recipe-details"
              id="recipe-details"
            >
              <button
                className="back-button"
                onClick={() =>
                  setSelectedRecipe(
                    null,
                  )
                }
              >
                ← Back to
                recipes
              </button>

              <div className="details-layout">
                <div className="details-image">
                  <img
                    src={
                      selectedRecipe.strMealThumb
                    }
                    alt={
                      selectedRecipe.strMeal
                    }
                  />
                </div>

                <div className="details-content">
                  <p className="section-label rainbow-label">
                    RECIPE
                  </p>

                  <h2>
                    {
                      selectedRecipe.strMeal
                    }
                  </h2>

                  <button
                    className={`details-favorite ${
                      isFavorite(
                        selectedRecipe.idMeal,
                      )
                        ? "favorite-active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleFavorite(
                        selectedRecipe,
                      )
                    }
                  >
                    {isFavorite(
                      selectedRecipe.idMeal,
                    )
                      ? "♥ Saved"
                      : "♡ Save Recipe"}
                  </button>

                  <div className="details-tags">
                    {selectedRecipe.strCategory && (
                      <span>
                        🍴{" "}
                        {
                          selectedRecipe.strCategory
                        }
                      </span>
                    )}

                    {selectedRecipe.strArea && (
                      <span>
                        🌎{" "}
                        {
                          selectedRecipe.strArea
                        }
                      </span>
                    )}
                  </div>

                  <h3>
                    Ingredients
                  </h3>

                  <div className="ingredients-list">
                    {getIngredients(
                      selectedRecipe,
                    ).map(
                      (
                        ingredient,
                        index,
                      ) => (
                        <div
                          className="ingredient"
                          key={`${selectedRecipe.idMeal}-${index}`}
                        >
                          <span>
                            ✓
                          </span>

                          {ingredient}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {selectedRecipe.strInstructions && (
                <div className="instructions">
                  <p className="section-label">
                    COOKING
                  </p>

                  <h3>
                    How to make it
                  </h3>

                  <p>
                    {
                      selectedRecipe.strInstructions
                    }
                  </p>
                </div>
              )}

              {selectedRecipe.strYoutube && (
                <a
                  className="youtube-link"
                  href={
                    selectedRecipe.strYoutube
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ Watch cooking
                  video
                </a>
              )}
            </section>
          )}

        {/* =========================
            CATEGORIES
        ========================= */}

        <section
          className="section categories-section"
          id="categories"
        >
          <div className="section-heading">
            <div>
              <p className="section-label">
                ✨ EXPLORE
              </p>

              <h2>
                Categories
              </h2>
            </div>

            <button className="view-all">
              View all →
            </button>
          </div>

          <div className="category-grid">
            {categories.map(
              (category) => (
                <button
                  className={`category-card ${category.className}`}
                  key={
                    category.name
                  }
                  onClick={() =>
                    handleCategoryClick(
                      category.name,
                    )
                  }
                >
                  <span className="category-icon">
                    {
                      category.emoji
                    }
                  </span>

                  <span className="category-content">
                    <strong>
                      {
                        category.name
                      }
                    </strong>

                    <small>
                      {
                        category.subtitle
                      }
                    </small>
                  </span>
                </button>
              ),
            )}
          </div>
        </section>

        {/* =========================
            CUISINES
        ========================= */}

        <section
          className="section cuisines-section"
          id="cuisines"
        >
          <div className="section-heading">
            <div>
              <p className="section-label rainbow-label">
                🌎 TASTE THE WORLD
              </p>

              <h2>
                Explore by Cuisine
              </h2>
            </div>
          </div>

          <div className="cuisine-grid">
            {cuisines.map(
              (cuisine) => (
                <button
                  className={`cuisine-card ${cuisine.className}`}
                  key={
                    cuisine.name
                  }
                  onClick={() =>
                    handleCuisineClick(
                      cuisine.name,
                    )
                  }
                >
                  <span className="cuisine-emoji">
                    {
                      cuisine.emoji
                    }
                  </span>

                  <span>
                    Explore

                    <strong>
                      {
                        cuisine.name
                      }
                    </strong>
                  </span>

                  <b>→</b>
                </button>
              ),
            )}
          </div>
        </section>

        {/* =========================
            POPULAR BITES
        ========================= */}

        <section
          className="section recipes-section"
          id="recipes"
        >
          <div className="section-heading">
            <div>
              <p className="section-label rainbow-label">
                RECIPES
              </p>

              <h2>
                Popular Bites
              </h2>
            </div>

            <button className="view-all">
              View all recipes →
            </button>
          </div>

          {popularLoading ? (
            <div className="loading-message">
              <div className="loader" />

              <p>
                Loading delicious
                bites...
              </p>
            </div>
          ) : popularRecipes.length ===
            0 ? (
            <div className="error-message">
              <span>
                🍽️
              </span>

              <p>
                Unable to load
                popular recipes.
              </p>
            </div>
          ) : (
            <div className="recipe-grid">
              {popularRecipes.map(
                (recipe) => (
                  <RecipeCard
                    key={
                      recipe.idMeal
                    }
                    recipe={
                      recipe
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>

        {/* =========================
            FAVORITES
        ========================= */}

        <section
          className="section favorites-section"
          id="favorites"
        >
          <div className="section-heading">
            <div>
              <p className="section-label rainbow-label">
                YOUR COLLECTION
              </p>

              <h2>
                Favorite Bites
              </h2>
            </div>

            <span className="favorite-count">
              {
                favorites.length
              }{" "}
              saved
            </span>
          </div>

          {favorites.length ===
          0 ? (
            <div className="empty-favorites">
              <span>
                ♡
              </span>

              <h3>
                No favorites yet
              </h3>

              <p>
                Click the heart on
                any recipe to save
                it here.
              </p>
            </div>
          ) : (
            <div className="recipe-grid">
              {favorites.map(
                (recipe) => (
                  <RecipeCard
                    key={
                      recipe.idMeal
                    }
                    recipe={
                      recipe
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>

        {/* =========================
            BANNER
        ========================= */}

        <section className="rainbow-banner">
          <div>
            <p>
              YOUR PERSONAL
              COLLECTION
            </p>

            <h2>
              Save every bite
              you love.
            </h2>
          </div>

          <a href="#favorites">
            ♡ View Favorites
          </a>
        </section>
      </main>
    </div>
  );
}

export default App;