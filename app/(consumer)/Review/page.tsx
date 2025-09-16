// app/reviews/page.tsx
import ConsumerReview from '@/components/consumer/ConsumerReview';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

const ReviewPage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  return <ConsumerReview user={user} />;
};

export default ReviewPage;
