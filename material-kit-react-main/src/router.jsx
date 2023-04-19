// import React from 'react'
// import { Switch, Route, Outlet } from 'react-router-dom';

// export default function router() {
//   return (
//     <>
//       <Switch>
//         <Route exact path="/" component={Home} />
//         <Route exact path="/about" component={About} />

//       </Switch>
//     </>
//   )
// }

/* ************************* an another one ************************* */

// import { Switch, Route, Outlet } from 'react-router-dom';
// import DashboardLayout from './layouts/dashboard';
// import SimpleLayout from './layouts/simple';
// import BlogPage from './pages/BlogPage';
// import UserPage from './pages/UserPage';
// import LoginPage from './pages/LoginPage';
// import Page404 from './pages/Page404';
// import ProductsPage from './pages/ProductsPage';
// import DashboardAppPage from './pages/DashboardAppPage';
// import PermissionsPage from './pages/PermissionsPage';

// export default function Router() {
//   return (
//     <Switch>
//       <Route path='/dashboard'>
//         <DashboardLayout>
//           <Outlet />
//         </DashboardLayout>
//       </Route>
//       <Route path='/login'>
//         <LoginPage />
//       </Route>
//       <Route>
//         <SimpleLayout>
//           <Outlet />
//         </SimpleLayout>
//       </Route>
//       <Route path='/404'>
//         <Page404 />
//       </Route>
//       <Route path='*'>
//         <Navigate to='/404' replace />
//       </Route>
//     </Switch>
//   );
// }

// function DashboardRoutes() {
//   return (
//     <>
//       <Route path='app'>
//         <DashboardAppPage />
//       </Route>
//       <Route path='user'>
//         <UserPage />
//       </Route>
//       <Route path='permissions'>
//         <PermissionsPage />
//       </Route>
//       <Route path='products'>
//         <ProductsPage />
//       </Route>
//       <Route path='blog'>
//         <BlogPage />
//       </Route>
//     </>
//   );
// }

// function SimpleRoutes() {
//   return (
//     <>
//       <Route path='404'>
//         <Page404 />
//       </Route>
//       <Route path='*'>
//         <Navigate to='/404' replace />
//       </Route>
//     </>
//   );
// }

// function DashboardLayout({ children }) {
//   return (
//     <div>
//       <h1>DashboardLayout</h1>
//       <nav>
//         <ul>
//           <li>
//             <Link to='/dashboard/app'>DashboardAppPage</Link>
//           </li>
//           <li>
//             <Link to='/dashboard/user'>UserPage</Link>
//           </li>
//           <li>
//             <Link to='/dashboard/permissions'>PermissionsPage</Link>
//           </li>
//           <li>
//             <Link to='/dashboard/products'>ProductsPage</Link>
//           </li>
//           <li>
//             <Link to='/dashboard/blog'>BlogPage</Link>
//           </li>
//         </ul>
//       </nav>
//       {children}
//     </div>
//   );
// }

// function SimpleLayout({ children }) {
//   return (
//     <div>
//       <h1>SimpleLayout</h1>
//       <nav>
//         <ul>
//           <li>
//             <Link to='/dashboard/app'>DashboardAppPage</Link>
//           </li>
//           <li>
//             <Link to='/404'>Page404</Link>
//           </li>
//         </ul>
//       </nav>
//       {children}
//     </div>
//   );
// }
