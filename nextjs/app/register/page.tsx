'use client';

import RegisterForm from '../components/RegisterForm';
import { Navigation } from '../components/Navigation';

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navigation />
      <div className="mt-10">
        <RegisterForm />
      </div>
    </div>
  );
}