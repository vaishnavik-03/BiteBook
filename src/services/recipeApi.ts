export type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
};

type MealResponse = {
  meals: Recipe[] | null;
};

const API_URL =
  "https://www.themealdb.com/api/json/v1/1";

/* =========================
   SEARCH RECIPES
========================= */

export async function searchRecipes(
  query: string,
): Promise<Recipe[]> {
  const response = await fetch(
    `${API_URL}/search.php?s=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const data: MealResponse =
    await response.json();

  return data.meals ?? [];
}

/* =========================
   RECIPES BY CATEGORY
========================= */

export async function getRecipesByCategory(
  category: string,
): Promise<Recipe[]> {
  const response = await fetch(
    `${API_URL}/filter.php?c=${encodeURIComponent(category)}`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch category recipes",
    );
  }

  const data: MealResponse =
    await response.json();

  return data.meals ?? [];
}

/* =========================
   RECIPES BY AREA
========================= */

export async function getRecipesByArea(
  area: string,
): Promise<Recipe[]> {
  const response = await fetch(
    `${API_URL}/filter.php?a=${encodeURIComponent(area)}`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch cuisine recipes",
    );
  }

  const data: MealResponse =
    await response.json();

  return data.meals ?? [];
}

/* =========================
   CUISINE SEARCH
========================= */

const cuisineKeywords: Record<
  string,
  string[]
> = {
  Indian: [
    "biryani",
    "curry",
    "tikka",
    "tandoori",
    "naan",
    "dal",
    "paneer",
    "masala",
  ],

  Italian: [
    "pasta",
    "pizza",
    "lasagne",
    "risotto",
    "carbonara",
    "bruschetta",
    "calzone",
  ],

  Mexican: [
    "taco",
    "burrito",
    "enchilada",
    "quesadilla",
    "chilli",
    "nachos",
    "fajita",
  ],

  Japanese: [
    "sushi",
    "ramen",
    "teriyaki",
    "yakitori",
    "udon",
    "miso",
    "tempura",
  ],

  Thai: [
    "thai",
    "pad",
    "curry",
    "satay",
    "tom yum",
    "noodle",
  ],

  Greek: [
    "greek",
    "moussaka",
    "souvlaki",
    "tzatziki",
    "gyro",
    "feta",
  ],
};

export async function getRecipesByCuisine(
  cuisine: string,
): Promise<Recipe[]> {
  /*
   * First try TheMealDB's official area
   * classification.
   */
  let areaRecipes: Recipe[] = [];

  try {
    areaRecipes =
      await getRecipesByArea(cuisine);
  } catch {
    areaRecipes = [];
  }

  /*
   * Then search actual dish names.
   * This is especially useful for cuisines
   * where TheMealDB's area classification
   * is small.
   */
  const keywords =
    cuisineKeywords[cuisine] ?? [
      cuisine,
    ];

  const keywordResults =
    await Promise.all(
      keywords.map((keyword) =>
        searchRecipes(keyword),
      ),
    );

  const allRecipes = [
    ...areaRecipes,
    ...keywordResults.flat(),
  ];

  /*
   * Remove duplicate meals using idMeal.
   */
  const uniqueRecipes = Array.from(
    new Map(
      allRecipes.map((recipe) => [
        recipe.idMeal,
        recipe,
      ]),
    ).values(),
  );

  return uniqueRecipes;
}

/* =========================
   SINGLE RECIPE DETAILS
========================= */

export async function getRecipeById(
  id: string,
): Promise<Recipe | null> {
  const response = await fetch(
    `${API_URL}/lookup.php?i=${encodeURIComponent(id)}`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch recipe details",
    );
  }

  const data: MealResponse =
    await response.json();

  return data.meals?.[0] ?? null;
}

/* =========================
   POPULAR RECIPES
========================= */

export async function getPopularRecipes(): Promise<
  Recipe[]
> {
  const response = await fetch(
    `${API_URL}/search.php?f=a`,
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch popular recipes",
    );
  }

  const data: MealResponse =
    await response.json();

  return data.meals ?? [];
}