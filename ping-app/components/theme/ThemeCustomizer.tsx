import { ThemeColorToggle } from "./ColorToggle";
import { ThemeModeToggle } from "./ModeToggle";

export default function ThemeCustomizer() {

  return (
    <div className="p-10 h-full">
      <h2 className="font-bold text-3xl">Theme Customizer</h2>
      <p className="text-sm text-muted-foreground">Customize your components colors.</p>

      <ThemeColorToggle/> 
      <ThemeModeToggle/>
    </div>
  );
}
