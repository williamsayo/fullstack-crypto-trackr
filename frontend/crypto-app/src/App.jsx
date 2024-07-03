import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/RootLayout'
import HomePage from './pages/Home'
import ErrorPage from './pages/Error'
import Prices from './pages/Prices'

function App() {

  const routes = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'price', element: <Prices /> }
      ]
    }
  ])

  return (
    <RouterProvider router={routes} />
  )
}

export default App
