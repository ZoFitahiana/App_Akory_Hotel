import { Router } from "express";
import { pool } from "./connectionToDatabase.js"; 

export const router = new Router();

router.post("/index", (req, res) => {
  const { Username, Email, Password, CPassword } = req.body;
  const { Emp_Email, Emp_Password } = req.body;
  
  if (Emp_Email && Emp_Password) {
    // Login/Sign-in Logic
    const sql = `
      SELECT * 
      FROM emp_login
      WHERE "Emp_Email" = $1 AND "Emp_Password" = $2  
    `;

    pool.query(sql, [Emp_Email, Emp_Password], (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Erreur de serveur');
      }

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Identifiants invalides' });
      }

      res.json({ success: true, message: 'Connexion réussie' });
    });
  } else if (Username && Email && Password) {
    // Registration/Signup Logic
    if (Username === "" || Email === "" || Password === "") {
      return res.status(400).json({ success: false, message: "Remplissez correctement les champs" });
    }

    // Check email 
    const emailQuery = `
      SELECT *
      FROM signup 
      WHERE Email = $1
    `;

    pool.query(emailQuery ,[Email] , (err , result ) =>{
      if (err){
        console.error(err.message) ;
        return res.status(500).send('Erreur de serveur') ;
      }

      if(result.rows.length > 0){
        return res.status(409).json({ success: false , message: 'Email déjà utilisé' });
      } else {
        const insertQuery = `
          INSERT INTO signup (Username, Email, Password)
          VALUES ($1, $2, $3)
        `;
  
        pool.query(insertQuery, [Username, Email, Password], (err) => {
          if (err) {
            console.error(err.message);
            return res.status(500).send('Erreur de serveur');
          }
  
          res.json({ success: true, message: 'Inscription réussie' });
        });
      }
    });
  } else {
     // Login/Sign-in Logic
     const { Email, Password } = req.body;

     // Perform validation, e.g., check if Email and Password are provided
 
     const selectQuery = `
       SELECT *
       FROM signup
       WHERE Email = $1 AND Password = $2
     `;
 
     pool.query(selectQuery, [Email, Password], (err, result) => {
       if (err) {
         console.error(err.message);
         return res.status(500).send('Erreur de serveur');
       }
 
       if (result.rows.length === 0) {
         return res.status(401).json({ success: false, message: 'Invalid credentials' });
       }
 
     
       res.json({ success: true, message: 'Sign-in successful' });
     });
  }
});

router.post('/guestdetailsubmit', (req, res) => {
  const {
    Name,
    Email,
    Country,
    Phone,
    RoomType,
    Bed,
    NoofRoom,
    Meal,
    cin,
    cout,
  } = req.body;

  if (Name === '' || Email === '' || Country === '') {
    res.status(400).json({ message: 'Fill the proper details' });
  } else {
    const sta = 'NotConfirm';
    // const nodays = parseInt((new Date(cout) - new Date(cin)) / (24 * 3600 * 1000));

    const sql = `INSERT INTO roombook("Name","Email","Country","Phone","RoomType","Bed","NoofRoom","Meal","cin","cout") 
                 VALUES ('${Name}','${Email}','${Country}','${Phone}','${RoomType}','${Bed}','${NoofRoom}','${Meal}','${cin}','${cout}'`;

    pool.query(sql, (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ message: 'Something went wrong' });
      } else {
        res.status(200).json({ message: 'Reservation successful' });
      }
    });
  }
});

// show all booking 
router.get("/roombook", (req, res) => {
  const countQuery = `
  SELECT * FROM roombook ;
  `;
  pool.query(countQuery, (err, data) => {
      if (err) {
          console.error(err.message);
          return res.status(500).send('Erreur de serveur');
      }
      res.send(data.rows);
  });
});