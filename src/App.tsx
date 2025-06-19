import { useRoutes } from 'raviger';
import { routes } from './routes/routes';
import { AppLayout } from './layouts/app-layout';

function App() {
  const route = useRoutes(routes);

  return (
    <AppLayout>
      {route}
    </AppLayout>
  )
}

export default App;
