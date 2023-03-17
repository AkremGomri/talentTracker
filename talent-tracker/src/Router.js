import { Navigate, useRoutes } from 'react-router-dom';
import UploadExcel from './test/UploadExcel';
// layouts


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <UploadExcel />,
      children: [
        { element: <Navigate to="/test/app" />, index: true },
        { path: 'app', element: <UploadExcel /> },

      ],
    }
  ]);

  return routes;
}
