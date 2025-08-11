import ThemeButton from "./ThemeButton";
import LanguageButton from "./LanguageButton";
export default function Header() {
  // const [mounted, setMounted] = useState(false);
  return (
    <header className="flex justify-end mr-4 sticky z-50 top-0">
      <LanguageButton></LanguageButton>
      <ThemeButton></ThemeButton>
    </header>
  );
}
