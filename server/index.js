const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
const mysql=require('mysql2');

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root@123',
    database:'crud_db'
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/students',(req,res)=>{
    const sqlSelect="SELECT * FROM contact_db";
    db.query(sqlSelect,(err,result)=>{
        if(err) console.log("Error"+err);
        else console.log("result: "+result);
        res.send(result);
        //res.json(result);
    });
});

app.post('/api/students',(req,res)=>{
    const { name, email, contact } = req.body;
    const sqlInsert = "INSERT INTO contact_db (name, email, contact) VALUES (?, ?, ?)";
    db.query(sqlInsert, [name, email, contact], (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.status(500).send("Error occurred while inserting data");
        } else {
            console.log("Result: " + result);
            res.send("Data inserted successfully");
        }
    });
});

app.delete("/api/remove/:id",(req,res)=>{
    const {id}=req.params;
    const sqlRemove="DELETE FROM contact_db WHERE id=?";
    db.query(sqlRemove,[id],(err,result)=>{
        if(err){
            console.log("Error: " + err);
            res.status(500).send("Error occurred while removing data");
        }else{
            console.log("Result: " + result);
            res.send("Data removed successfully");
        }
    });
});
app.get("/api/get/:id",(req,res)=>{
    const {id}=req.params;
    const sqlGet="SELECT * FROM contact_db WHERE id=?";
    db.query(sqlGet,[id],(err,result)=>{
        if(err){
            console.log("Error: " + err);
            res.status(500).send("Error occurred while fetching data");
        }else{
            console.log("Result: " + result);
            res.send(result);
        }
    });
});

app.put("/api/update/:id",(req,res)=>{
    const {id}=req.params;
    const {name,email,contact}=req.body;
    const sqlUpdate="UPDATE contact_db SET name=?, email=?, contact=? WHERE id=?";
    db.query(sqlUpdate,[name,email,contact,id],(err,result)=>{
        if(err){
            console.log("Error: " + err);
            res.status(500).send("Error occurred while updating data");
        }else{
            console.log("Result: " + result);
            res.send("Data updated successfully");
        }
    });
});


app.get('/',(req,res)=>{
//     const sqlInsert="INSERT INTO contact_db (name,email,contact) VALUES ('Parth', 'parth123@gmail.com', '7678946475')";
//     db.query(sqlInsert,(err,result)=>{
//         if(err) console.log("Error"+err);
//         else console.log("result: "+result);
//         res.send("Hello World");

//     });
    
// }  );
});

app.listen(5001,()=>{
    console.log("Server running on http://localhost:5001");
});


