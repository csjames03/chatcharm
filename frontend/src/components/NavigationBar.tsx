import ThemeToggle from "./ThemeToggle"
import Logo from "./Logo"

const NavigationBar = () => {
  return (
    <nav className="w-auto h-[80px] bg-emerald-400 dark:bg-emerald-500 py-2 px-2 md:px-10 lg:px-20 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
    </nav>
  )
}

export default NavigationBar