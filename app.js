const supabase = window.supabase.createClient(
"https://hwpeegcsdgxgcybuosfv.supabase.co",
"sb_publishable_LhuHoUS_DR4o2Pp3aqbNBw_IXwHo2fD"
);

async function loadFeed(){

const { data } = await supabase
.from("humans.posts")
.select("*")
.order("created_at",{ascending:false})
.limit(10);

const feed=document.getElementById("feed");
if(!feed) return;

feed.innerHTML="";

data?.forEach(post=>{
const type =
post.type==="help_request"
? "Help requested"
: "Help offered";

const div=document.createElement("div");
div.className="feed-item";

div.innerHTML=`
<strong>${post.region || "Unknown location"}</strong><br>
${post.title || ""}
<div class="status">${type}</div>
`;

feed.appendChild(div);
});
}
