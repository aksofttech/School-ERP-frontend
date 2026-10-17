import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomeworkRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return null;
}
