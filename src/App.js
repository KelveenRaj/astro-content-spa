import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import ContentGuide from "./pages/contentGuide";

const router = createBrowserRouter(
  createRoutesFromElements(<Route index element={<ContentGuide />} />)
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
