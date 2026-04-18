const express = require('express');
const {adminAuth} = require('../src/middlewares/auth');

const app = express();
// app.use();

// app.use('/admin',adminAuth);

app.get('/admin/data',(req, res)=>{
    console.log("In admin data");

    try{

        throw new Error("dggdddh");
    }
    catch(err)
    {
        res.send("some error has occured");
    }
    //  throw new Error("dggdddh");
    res.send("All admin data");
});

app.post('/admin/deleteUser',(req, res)=>{
    res.send("Deleted admin data");
});

app.use('/',(err, req, res, next)=>{

    console.log("I am in /");
    if(err)
    {
        res.status(500).send("something went wrong");
    }
    res.send("I am /");
});


// app.use('/user', (req, res, next)=>{
//     console.log("User 1 function");
//     next();
//     res.send("User");
// },
// (req, res, next)=>{
//     console.log("User 2 function");
//     res.send("User 2");
// }
// );

// app.get(/^\/ab+c$/,(req, res)=>{
//     res.send("This is your user");
// });

// app.get(/.*fly$/,(req, res)=>{
//     res.send("Ends with fly.");
// });

// app.get('/xyz',(req, res)=>{
//     res.send("This is your 2nd user");
// });

// app.get('/test',(req, res)=>{
//     res.send("Hello from GET test");
// });

// app.post('/test', (req, res)=>{
//     res.send("Hello from POST test");
// });

// app.delete('/test', (req, res)=>{
//     res.send("Data deleted successfully");
// });


// app.use('/test/1', (req, res)=>{
//     res.send("Hello from test/1");
// })

// app.use('/test',(req, res)=>{
//     res.send("Hello from test ");
// })

// app.use('/',(req, res)=>{
//     res.send("Hello from the  server");
// })



app.listen(3000, ()=>{
    console.log("Server is listening on Port number 3000....");
});