const supabase = window.supabase.createClient(
"https://hwpeegcsdgxgcybuosfv.supabase.co",
"sb_publishable_LhuHoUS_DR4o2Pp3aqbNBw_IXwHo2fD"
);

/* =========================
USER AUTO CREATE
========================= */
async function ensureUser(){

 const {data:{user}} = await supabase.auth.getUser();
 if(!user) return null;

 const {data} = await supabase
  .from("humans_users")
  .select("id")
  .eq("id", user.id)
  .single();

 if(!data){
   await supabase.from("humans_users").insert({ id:user.id });
 }

 return user;
}

/* =========================
CREATE POST
========================= */
async function createPost(type,title,desc,region){

 const user = await ensureUser();
 if(!user) return alert("Login required");

 await supabase.from("humans_posts").insert({
  user_id:user.id,
  type,
  title,
  description:desc,
  region
 });
}

/* =========================
LOAD POSTS
========================= */
async function loadPosts(){

 const {data} = await supabase
  .from("humans_posts")
  .select("*")
  .order("created_at",{ascending:false});

 return data || [];
}

/* =========================
RESPOND TO HELP
========================= */
async function respond(postId,message){

 const user = await ensureUser();
 if(!user) return;

 await supabase.from("humans_responses").insert({
  post_id:postId,
  user_id:user.id,
  message
 });
}

/* =========================
PRIVATE MESSAGE
========================= */
async function sendMessage(to,message){

 const user = await ensureUser();
 if(!user) return;

 await supabase.from("humans_messages").insert({
  sender:user.id,
  receiver:to,
  message
 });
}

/* =========================
CONFIRM HELP
========================= */
async function confirmHelp(postId,helperId){

 const user = await ensureUser();

 await supabase.from("humans_help_confirmations").insert({
  post_id:postId,
  helper_id:helperId,
  requester_id:user.id,
  confirmed:true
 });

 await supabase.rpc("increase_trust",{ uid:helperId });
}
