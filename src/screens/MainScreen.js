import HeaderCompo from "../components/HeaderCompo";
import TabBarLef from "../components/TabBarLeft";
import StatisticsDashboard from "./ThongKeDoanhThu";
import "../StyleTabBar.css";
const MainScreen = () => {
  return (
    <div style={{ height: "100%" }}>
      <HeaderCompo color="#F0F2F2" title={"S7M-Store"}></HeaderCompo>
      <div className="mainScreenContainer">
        <div>
          <TabBarLef />
        </div>
        <div style={{position: 'sticky', top: 0, height: 1}}>
          <div
            style={{
              height: "100vh",
              width: 1,
              backgroundColor: "black",
            }}
          ></div>
        </div>
        <div style={{width: "100%"}}>
          <StatisticsDashboard></StatisticsDashboard>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
