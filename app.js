const supabase = window.supabase.createClient(
"https://hwpeegcsdgxgcybuosfv.supabase.co",
"sb_publishable_LhuHoUS_DR4o2Pp3aqbNBw_IXwHo2fD"
);

// ---------- FEED ----------
async function loadActivity(){
  const feed=document.getElementById("feed");
  if(!feed) return;

  const {data}=await supabase
    .from("posts")
    .select("*")
    .order("created_at",{ascending:false})
    .limit(20);

  feed.innerHTML="";

  data?.forEach(p=>{
    const div=document.createElement("div");
    div.className="feed-item";

    const type=p.type==="help_request"?"Help requested":"Help offered";

    div.innerHTML=`
  <strong>${p.region||"Unknown"}</strong><br>
  ${p.title||""}<br>
  <span class="status">${type}</span><br>
  <button onclick="location.href='chat.html?user=${p.user_id}'">
    Contact
  </button>
`;

    feed.appendChild(div);
  });
}

// ---------- HELP ----------
async function createHelp(e){
  e.preventDefault();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return alert("Login required");

  await supabase.from("posts").insert({
    user_id:user.id,
    type:"help_request",
    title:e.target.title.value,
    description:e.target.message.value,
    region:e.target.location.value
  });

  location.href="activity.html";
}

// ---------- OFFER ----------
async function createOffer(e){
  e.preventDefault();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return alert("Login required");

  await supabase.from("posts").insert({
    user_id:user.id,
    type:"help_offer",
    title:e.target.title.value,
    description:e.target.message.value,
    region:e.target.location.value
  });

  location.href="activity.html";
}

// ---------- PROFILE ----------
async function ensureUser(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return;

  const {data}=await supabase
    .from("users")
    .select("id")
    .eq("id",user.id)
    .maybeSingle();

  if(!data){
    await supabase.from("users").insert({id:user.id});
  }
}

// ---------- LOGIN ----------
async function login(){
  const email=document.getElementById("email").value;
  await supabase.auth.signInWithOtp({email});
  alert("Check email for login link");
}

async function logout(){
  await supabase.auth.signOut();
  location.reload();
}

// ---------- STATUS ----------
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
  ensureUser();
  showAuth();
});
// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage(e){
  e.preventDefault();

  const { data:{user} } = await supabase.auth.getUser();
  if(!user) return alert("Login required");

  const receiver = document.getElementById("receiver").value;
  const text = document.getElementById("msg").value;

  const { error } = await supabase.from("messages").insert({
    sender:user.id,
    receiver,
    text
  });

  if(error) return alert(error.message);

  document.getElementById("msg").value="";
  loadMessages(receiver);
}


// ===============================
// LOAD CHAT
// ===============================

async function loadMessages(otherUser){

  const chat=document.getElementById("chat");
  if(!chat) return;

  const { data:{user} } = await supabase.auth.getUser();
  if(!user) return;

  const { data } = await supabase
    .from("messages")
    .select("*")
    .or(`sender.eq.${user.id},receiver.eq.${user.id}`)
    .order("created_at",{ascending:true});

  chat.innerHTML="";

  data?.forEach(m=>{
    if(
      (m.sender===user.id && m.receiver===otherUser) ||
      (m.receiver===user.id && m.sender===otherUser)
    ){
      const div=document.createElement("div");
      div.style.margin="5px 0";
      div.style.padding="6px";
      div.style.background=m.sender===user.id?"#1d4ed8":"#111827";
      div.innerText=m.text;
      chat.appendChild(div);
    }
  });
}
