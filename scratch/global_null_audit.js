const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkNulls() {
  console.log("Checking for critical NULL values...");

  // Check Profiles
  const { data: profiles } = await supabase.from('profiles').select('id, email, name, role');
  const nullNames = profiles?.filter(p => !p.name) || [];
  const nullRoles = profiles?.filter(p => !p.role) || [];
  console.log(`Profiles: ${profiles?.length || 0} total. ${nullNames.length} missing names, ${nullRoles.length} missing roles.`);

  // Check Sessions
  const { data: sessions } = await supabase.from('sessions').select('id, mentor_id, student_id, status, amount');
  const nullMentors = sessions?.filter(s => !s.mentor_id) || [];
  const nullAmounts = sessions?.filter(s => s.amount === null) || [];
  console.log(`Sessions: ${sessions?.length || 0} total. ${nullMentors.length} missing mentor_id, ${nullAmounts.length} missing amounts.`);

  // Check Payments
  const { data: payments } = await supabase.from('payments').select('id, amount, status');
  const nullPaymentAmounts = payments?.filter(p => p.amount === null) || [];
  console.log(`Payments: ${payments?.length || 0} total. ${nullPaymentAmounts.length} missing amounts.`);

  console.log("Audit complete.");
}

checkNulls();
