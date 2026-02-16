window.sb = window.supabase.createClient(
  "https://hwpeegcsdgxgcybuosfv.supabase.co",
  "sb_publishable_LhuHoUS_DR4o2Pp3aqbNBw_IXwHo2fD",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
