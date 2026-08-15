import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout(): ReactElement {
  return (
    <div className="min-h-screen bg-black">
      <Outlet />
    </div>
  );
}
