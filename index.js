const express = require("express");
const app = express();
const port = 3000;

const { firebase } = require("./src/firebase/index");
app.use(express.json()); // This is to parse JSON bodies

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const sendNotification = async (token,message,senderEmail) => {
    try {
        await firebase.messaging().send({
            token: token,
            notification: {
              title: `${senderEmail}`,
              body: message,
            },
          });
        
    } catch (error) {
        console.log("Notification failed ",error)
        
    }
  
};


app.post("/api/v1/sendNotification", (req, res) => {
  const { token, message, senderEmail } = req.body;

  if (!token || !message) {
    return res.status(400).json({ error: "Token and message are required" });
  }

  sendNotification(token, message, senderEmail)
    .then(() => res.status(200).json({ success: true, message:"Notification has been send successfully" }))
    .catch((error) => res.status(500).json({ error: error.message }));
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
