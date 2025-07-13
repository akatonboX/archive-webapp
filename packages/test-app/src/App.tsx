import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router";
import './App.css'
import { Sample1Page } from './page/sample1Page';
import { Home } from './page/home';
import { DirectorySlash } from "./common/lib/directorySlash";
import { AnchorPage } from "./page/anchorPage";
import { LoginProvider } from "./common/lib/authentication";
import { createDummyLogin, DummyLoginPage } from "./common/lib/dummyLogin";
import { ApiPage } from "./page/apiPage";
import { createAuth0Login } from "./common/lib/auth0Login";


function App() {
  const loginImplementation = import.meta.env.VITE_IS_ENABLE_DUMMY_LOGIN == "true" ? createDummyLogin({appName: "test-app"})
                                                                                   : createAuth0Login(import.meta.env.VITE_AUTH0_DOMAIN, import.meta.env.VITE_AUTH0_CLIENT_ID);
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
            <LoginProvider implementation={loginImplementation}>
              <Outlet />
            </LoginProvider>
          </>
        }
      >
        
        <Route path="/dummy-login" element={<DummyLoginPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/sample1" element={<Sample1Page />} />
        <Route path="/anchor/page1" element={<AnchorPage title="page1"/>} />
        <Route path="/anchor/page2" element={<AnchorPage title="page2" />} />
        <Route path="/api" element={<ApiPage />} />
      </Route>
    ), {basename: "/test-app"})} />
  )
}

export default App
