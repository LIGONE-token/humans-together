const supabase = window.supabase.createClient(
"https://hwpeegcsdgxgcybuosfv.supabase.co",
"sb_publishable_LhuHoUS_DR4o2Pp3aqbNBw_IXwHo2fD"
);

async function loadActivity(){
  const feed=document.getElementById("feed");
  if(!feed) return;

  const {data}=await supabase
    .from("posts")
    .select("*")
    .order("created_at",{ascending:false});

  feed.innerHTML="";

  data?.forEach(p=>{
    const div=document.createElement("div");
    div.style.padding="6px";
    div.style.borderBottom="1px solid #333";
    div.innerHTML=`<b>${p.region||"Unknown"}</b><br>${p.title||""}`;
    feed.appendChild(div);
  });
}

async function createHelp(e){
  e.preventDefault();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return alert("Login first");

  await supabase.from("posts").insert({
    user_id:user.id,
    type:"help_request",
    title:e.target.title.value,
    description:e.target.message.value,
    region:e.target.location.value
  });

  location.href="activity.html";
}

async function createOffer(e){
  e.preventDefault();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return alert("Login first");

  await supabase.from("posts").insert({
    user_id:user.id,
    type:"help_offer",
    title:e.target.title.value,
    description:e.target.message.value,
    region:e.target.location.value
  });

  location.href="activity.html";
}

async function login(){
  const email=document.getElementById("email").value;
  await supabase.auth.signInWithOtp({email});
  alert("Check your email login link");
}

async function logout(){
  await supabase.auth.signOut();
  location.reload();
}

async function showAuth(){
  const el=document.getElementById("auth");
  if(!el) return;

  const {data:{user}}=await supabase.auth.getUser();
  if(user){
    el.innerHTML=`${user.email} <button onclick="logout()">Logout</button>`;
  }else{
    el.innerHTML=`<a href="login.html">Login</a>`;
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  loadActivity();
  showAuth();
});
