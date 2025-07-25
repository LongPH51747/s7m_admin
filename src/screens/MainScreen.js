import HeaderCompo from "../components/HeaderCompo";
import TabBarLef from "../components/TabBarLeft";
import ThongKeDoanhThu from "./ThongKeDoanhThu";
// import "../StyleTabBar.csc";
import Sidebar from "../components/Sidebar";
import HeaderTwo from "../components/HeaderTwo";
import TopBar from "../components/TopBar";
const MainScreen = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="w-full">
        <TopBar/>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar/>

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <ThongKeDoanhThu/>
        </main>
      </div>

    </div>
  );
};

export default MainScreen;
