import { useRoutes } from 'raviger';
import { routes } from './routes/routes';

function App() {
  const route = useRoutes(routes);

  return (
    <>
      {route}
    </>
  )
}

export default App;
