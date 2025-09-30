'use client';

import LoginForm from '../components/LoginForm';
import { Navigation } from '../components/Navigation';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />
      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
}