import { Router } from 'express';
import { supabase } from '../../config/supabase';

const router = Router();

router.post('/sync', async (req, res) => {
  const { id, email, name } = req.body as { id?: string; email?: string; name?: string };

  if (!id || !email) {
    return res.status(400).json({ error: 'id and email are required' });
  }

  const safeName = name || email.split('@')[0] || 'Usuario';

  try {
    const { data: existingUser, error: userSelectError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (userSelectError) {
      console.error('Error checking existing user in Supabase:', userSelectError);
      return res.status(500).json({ error: 'Failed to check user in database' });
    }

    if (!existingUser) {
      const { error: insertUserError } = await supabase
        .from('users')
        .insert({
          id,
          email,
          name: safeName
        });

      if (insertUserError) {
        console.error('Error inserting user in Supabase:', insertUserError);
        return res.status(500).json({ error: 'Failed to create user in database' });
      }
    }

    const { data: existingCustomer, error: customerSelectError } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', id)
      .maybeSingle();

    if (customerSelectError) {
      console.error('Error checking existing customer in Supabase:', customerSelectError);
      return res.status(500).json({ error: 'Failed to check customer in database' });
    }

    if (!existingCustomer) {
      const { error: insertCustomerError } = await supabase
        .from('customers')
        .insert({
          user_id: id,
          email,
          name: safeName
        });

      if (insertCustomerError) {
        console.error('Error inserting customer in Supabase:', insertCustomerError);
        return res.status(500).json({ error: 'Failed to create customer in database' });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Unexpected error syncing user with Supabase:', err);
    return res.status(500).json({ error: 'Unexpected error syncing user' });
  }
});

export default router;

