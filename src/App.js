import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import ContentGuide from "./pages/contentGuide";

const router = createHashRouter(
  createRoutesFromElements(<Route index element={<ContentGuide />} />)
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
