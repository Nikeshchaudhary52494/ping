type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green" | "Orange" | "Violet" | "Yellow"
interface ThemeColorStateParams{
    themeColor: ThemeColors;
    setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>> 
}