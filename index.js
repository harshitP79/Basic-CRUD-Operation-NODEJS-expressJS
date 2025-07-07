// const http = require("http");
// const fs = require('fs');
// const url = require('url');



// const server = http.createServer((req,res)=>{
    
//     // console.log("Request received");
//     // res.end("HELLO World!");


//     const log = `${new Date().toLocaleString()}-New request Received at - ${req.url}\n`
//     fs.appendFile("log.txt", log,(err)=>{
//         if(err) console.log(err);
//     });

//     const newUrl= url.parse(req.url,true);

//     switch(newUrl.pathname){
//         case"/":
//             res.end("Hello World");
//             break;
//         case "/about":
//             res.end("About Page!");
//             break;
//         case "/contact":
//             res.end("Contact Page!");
//             break;
//         case "/search":
//             res.end(`Search page for name : ${newUrl.query.name} and job : ${newUrl.query.job}`)
//             break;
//         case "/login":
//             if(req.method ==="GET"){
//                 res.end("Login page with GET method");
//             }
//             else if(req.method === "POST"){
//                 res.end("Login page with POST method");
//             }
//             break;
//         default:
//             res.end("404 page not found!");
//             break;
//         }
// })

// server.listen(8000,()=>{
//     console.log("Server Running on port 8000");
// })

// REST API 
// app.get("/",(req,res)=>{
//     const html = `<h1>HEllo World</h1>
//     <form action="/search" method="get">
//         <input type="text" name="name" palceholder="Enter your name">
//         <input type="text" name="job" palceholder="Enter your role">  
//         <button type="submit">Submit</button> 
//     </form>`
//     res.send(html);
// })

// app.get("/search",(req,res)=>{
//     res.send(`The Name is ${req.query.name} and role is : ${req.query.job}`);
// })

const express = require("express");
const users = require("./MOCK_DATA.json")
const app = express();
const mongoose = require("mongoose");
const fs = require('fs');
const router = express.Router();
const UserModel = require("./models/user")
const url = "mongodb+srv://harshitp79:oZSAnSi56TJj1l1u@cluster0.buykhbj.mongodb.net/"

mongoose.connect(url).then(()=>{
    console.log("connected to mongodb")
}).catch((err)=>{
    console.log(err)
})



app.use(express.urlencoded({extended: true}));
app.use((req,res,next)=>{
    console.log("middleware 1");
    next();
})

app.use((req,res,next)=>{
    console.log("middleware 2");
    next();
})

const saveUsersToFile = () => {
    fs.writeFileSync("./MOCK_DATA.json",JSON.stringify(users, null, 2));
};

router.route("/api/users/")
.get((req,res)=>{
    res.set("X-developed-by", "Harshit");
    res.json(users);
})
.post(async (req,res)=>{
    const {first_name, last_name , email , gender}=req.body;

    if(!first_name || !last_name || !email || !gender){
        return res.json({error:"All Fields are required!"});
    }
    
    // const maxId = users.length;
    // const newId = maxId +1 ;

    // const newUser = {
    //     id: newId,
    //     first_name,
    //     last_name,
    //     email,
    //     gender
    // };

    // users.push(newUser);
    // saveUsersToFile();
    // res.json(newUser);

    const user = new UserModel({
        first_name,
        last_name,
        email,
        gender
    });
    await user.save();
    res.json(user);
})

router.route("/api/users/:id")
.get((req,res)=>{
    const {id} =req.params;
    const user = users.find((user)=>user.id === parseInt(id));
    if(!user){
        return res.status(404).json({error:"user Not Found!"});
    }
  
    res.json(user)
})
.patch((req,res)=>{
    const {id} =req.params;
    const {first_name, last_name , email , gender}=req.body;

    const userIndex = users.findIndex((user)=>user.id===parseInt(id));

    if(userIndex === -1){
        return res.status(404).json({error:"user Not Found!"});
    }

    const updatedUser = {
        ...users[userIndex],
        first_name: first_name || users[userIndex].first_name,
        last_name: last_name || users[userIndex].last_name,
        email: email || users[userIndex].email,
        gender: gender || users[userIndex].gender
    };

    users[userIndex] = updatedUser;
    saveUsersToFile();
    res.json(updatedUser);
})
.delete((req,res)=>{
    const {id} =req.params;
    const userIndex = users.findIndex((user)=>user.id===parseInt(id));

    if(userIndex === -1){
        res.status(404).json({error:"User Not Found"});
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    saveUsersToFile();
    res.json(deletedUser);

})

app.use(router);

app.listen(8000,()=>{
    console.log("Server Running on port 8000");
})
