import ThemeButton from "./ThemeButton";
import LanguageButton from "./LanguageButton";
const Header = () => {
  return (
    <header className="flex justify-end mr-4 md:sticky z-50 top-0">
      <LanguageButton></LanguageButton>
      <ThemeButton></ThemeButton>
    </header>
  );
};

export default Header;
