import { useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router";
import './App.css'
import lodash from "lodash";
import { Sample1Page } from './page/sample1Page';

function App() {
  console.log(lodash.VERSION);
  return (
    <RouterProvider router={createBrowserRouter(createRoutesFromElements(
      <Route 
        path='/' 
        errorElement={
            <div>error</div>
        }
        element={
          <Outlet />
        }
      >
        <Route path="/sample1" element={<Sample1Page />} />
      </Route>
    ), {basename: "/test-app"})} />
  )
}

export default App
