import "./App.less";
import UserInfoProvider from "./context/userInfo";
import ViewportProvider from "./context/viewport";
import Routers from "./route";
function App() {
  return (
    <UserInfoProvider>
      <ViewportProvider>
        <div className="App">
          <Routers />
        </div>
      </ViewportProvider>
    </UserInfoProvider>
  );
}

export default App;
