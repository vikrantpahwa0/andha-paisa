import AppRoutes from "./routes/app-routes.jsx";
import UserProfileLoader from "./components/common/user-profile-loader.jsx";

function App() {
  return (
    <UserProfileLoader>
      <AppRoutes />
    </UserProfileLoader>
  );
}

export default App;