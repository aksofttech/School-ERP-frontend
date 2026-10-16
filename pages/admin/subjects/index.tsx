import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SubjectsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/payroll');
  }, [router]);

  return null;
}
