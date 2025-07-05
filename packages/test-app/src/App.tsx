import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router";
import './App.css'
import { Sample1Page } from './page/sample1Page';
import { Home } from './page/home';
import { DirectorySlash } from "./common/lib/directorySlash";
import { AnchorPage } from "./page/anchorPage";


function App() {
  return (
    <RouterProvider router={createBrowserRouter(createRoutesFromElements(
      <Route 
        path='/' 
        errorElement={
            <div>error</div>
        }
        element={
          <>
            <DirectorySlash />
            <Outlet />
          </>
        }
      >
              
        <Route path="/" element={<Home />} />
        <Route path="/sample1" element={<Sample1Page />} />
        <Route path="/anchor/page1" element={<AnchorPage title="page1"/>} />
        <Route path="/anchor/page2" element={<AnchorPage title="page2" />} />
      </Route>
    ), {basename: "/test-app"})} />
  )
}

export default App
