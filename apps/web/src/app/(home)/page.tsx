import { HumanHomePage, MachineHomePage } from "./_components/home";
import { HomeSwitcher } from "./_components/home-switcher";

export default function Page() {
  return <HomeSwitcher human={<HumanHomePage />} machine={<MachineHomePage />} />;
}
