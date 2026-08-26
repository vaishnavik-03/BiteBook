function Navbar() {
  return (
    <header className="navbar">
      <h1 className="logo">
        <span>B</span>ite<span>B</span>ook
      </h1>

      <nav>
        <a className="active" href="#home">
          Home
        </a>

        <a href="#categories">
          Categories
        </a>

        <a href="#favorites">
          ♡ Favorites
        </a>
      </nav>
    </header>
  );
}

export default Navbar;