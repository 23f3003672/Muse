const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function check() {
  const { data, error } = await supabase.from('products').insert([
    { product_name: 'test', sku: 'test-123', slug: 'test-123', price: 10, product_type: 'suit' }
  ]);
  console.log('Insert:', error);
}
check();
