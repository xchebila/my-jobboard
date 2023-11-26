const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require("nodemailer");

const app = express();

const PORT = 5500;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'xiam',
  password: 'xiam',
  database: 'BDD'
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function (req, file, cb) {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    cb(null, formattedDate + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());

app.use(
  cors({
      origin: '*', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
      allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);

app.use(cookieParser());


connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});


app.post('/Register', upload.single('CV'), async (req, res) => {
  let Nom = req.body.Nom;
  let Prenom = req.body.Prenom;
  let Email = req.body.Email;
  let MDP = req.body.mdp;
  let Telephone = req.body.Telephone;
  let Role = req.body.Roles;

  if (!req.file) {
    return res.status(400).json({ error: 'Le CV est obligatoire.' });
  }

  const fileName = req.file.originalname;

  if (!fileName.toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ error: 'Le CV doit être au format PDF.' });
  }

  const CVPath = req.file.path;

  connection.query('SELECT * FROM Utilisateur WHERE Email = ?', [Email], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'e-mail :', err.message);
      return res.status(500).json({ error: 'Erreur lors de la vérification de l\'e-mail' });
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*0-9]).{8,}$/.test(MDP)) {
      return res.status(400).json({ error: 'Le mot de passe ne respecte pas les critères.' });
    }    
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(Email)) {
      return res.status(400).json({ error: 'L\'e-mail n\'est pas au bon format.' });
    }    
    if (rows.length > 0) {
      return res.status(400).json({ error: 'L\'e-mail est déjà enregistré' });
    } else {
      bcrypt.hash(MDP, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Erreur lors du hachage du mot de passe :', hashErr.message);
          return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe' });
        }

        var form_data = {
          Nom: Nom,
          Prenom: Prenom,
          Email: Email,
          mdp: hashedPassword,
          Telephone: Telephone,
          Roles: Role,
          CV: CVPath, 
        };

        connection.query('INSERT INTO Utilisateur SET ?', form_data, (insertErr) => {
          if (insertErr) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', insertErr.message);
            res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
          } else {
            res.status(200).json({ message: 'Utilisateur créé avec succès' });
          }
        });
      });
    }
  });
});

app.post('/CandidSpont',(req,res)=>{

  let Nom = req.body.Nom;
  let Email = req.body.Email;
  let Telephone = req.body.Téléphone;
  let Message = req.body.Message
  

  var form_data = {
      Nom: Nom,
      Email: Email,
      Téléphone: Telephone,
      Message: Message
  }

   connection.query('INSERT INTO CandidSpont SET ?',form_data,(err, result) => {
    if (err) {
        console.error('Error inserting item:', err.message);
        res.status(500).json({ error: 'Error inserting item' });
    } else {
        res.status(200).json({ message: 'Item created successfully' });
    }
  }
  )

});

app.post('/login', async (req, res) => {
  const Email = req.body.email;
  const MDP = req.body.mdp;

  try {
    connection.query('SELECT id, Email, mdp, Roles FROM Utilisateur WHERE Email = ?', Email, async function (errors, resultats, fields) {
      if (errors) {
        console.error(errors);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
        return;
      }

      if (resultats.length > 0) {
        const Utilisateur = resultats[0];
        const isPasswordValid = await bcrypt.compare(MDP, Utilisateur.mdp);
        if (isPasswordValid) {
          res.json({ success: true, message: 'Connexion réussie', role: Utilisateur.Roles, id: Utilisateur.id });
        } else {
          res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
        }
      } else {
        res.status(401).json({ success: false, message: "Adresse e-mail introuvable" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
});

app.put('/Profil/put/:id', upload.single('CV'), async (req, res) => {
  const resourceId = parseInt(req.params.id);
  const Nom = req.body.Nom;
  const Prenom = req.body.Prenom;
  const Email = req.body.Email;
  const Telephone = req.body.Telephone;
  const MDP = req.body.mdp;

  let password = null;
  if (MDP) {
    password = await bcrypt.hash(MDP, 10);
  }

  const CVPath = req.file ? req.file.path : null;

  const form_data = {};

  if (Nom) {
    form_data.Nom = Nom;
  }

  if (Prenom) {
    form_data.Prenom = Prenom;
  }

  if (Email) {
    form_data.Email = Email;
  }

  if (Telephone) {
    form_data.Telephone = Telephone;
  }

  if (password) {
    form_data.mdp = password;
  }

  if (CVPath) {
    connection.query('SELECT CV FROM Utilisateur WHERE id = ?', [resourceId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      const oldCVPath = results[0].CV;

      if (oldCVPath) {
        fs.unlink(oldCVPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(unlinkErr);
            return res.status(500).json({ success: false, message: 'Internal server error' });
          }
        });
      }

      form_data.CV = CVPath;

      connection.query('UPDATE Utilisateur SET ? WHERE id = ?', [form_data, resourceId], (errors, resultats, fields) => {
        if (errors) {
          console.error(errors);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        return res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
      });
    });
  } else {
    connection.query('UPDATE Utilisateur SET ? WHERE id = ?', [form_data, resourceId], (errors, resultats, fields) => {
      if (errors) {
        console.error(errors);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
      return res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
    });
  }
});

app.get('/Profil/get/:id', async (req, res) => {
  const id = req.params.id;
  connection.query('SELECT id, Nom, Prenom, Email, mdp, Telephone, CV FROM Utilisateur WHERE id = ?', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results);
  });
});

app.get('/Annonce', (req, res) => {
  connection.query("SELECT Annonce.Titre, Entreprise.Lieu, Annonce.Description, Annonce.Niveau, Entreprise.Domaine, Entreprise.Image, Annonce.id FROM Annonce, Entreprise WHERE Entreprise.id = Annonce.id_Entreprise", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


app.get('/JobCard/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT Annonce.Titre, Entreprise.Lieu, Entreprise.Image, Annonce.Niveau, Entreprise.Domaine, Annonce.Date, Annonce.FullDescription, Annonce.Horaire, Annonce.Salaire, Annonce.id FROM Annonce, Entreprise WHERE Entreprise.id = Annonce.id_Entreprise AND Annonce.id = ?`;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des détails de l\'annonce :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des détails de l\'annonce' });
    } else {
      res.json(results);
    }
  });
});

app.put("/Annonce/put/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  console.log(resourceId)
  const updatedData = req.body;
  console.log(updatedData)

  try {
   await connection.query('UPDATE Annonce SET ? WHERE id = ?', [updatedData, resourceId], async function (errors, resultats, fields){
      if (errors) {
        console.error(errors);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      else{
        res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
      }
     });
    }catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
});

app.put("/Utilisateur/put/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  console.log(resourceId)
  const updatedData = req.body;
  console.log(updatedData)

  try {
   await connection.query('UPDATE Utilisateur SET ? WHERE id = ?', [updatedData, resourceId], async function (errors, resultats, fields){
      if (errors) {
        console.error(errors);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      else{
        res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
      }
     });
    }catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
});

app.put("/Entreprise/put/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  console.log(resourceId)
  const updatedData = req.body;
  console.log(updatedData)

  try {
   await connection.query('UPDATE Entreprise SET ? WHERE id = ?', [updatedData, resourceId], async function (errors, resultats, fields){
      if (errors) {
        console.error(errors);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      else{
        res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
      }
     });
    }catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
});

app.put("/CandidSpont/put/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  console.log(resourceId)
  const updatedData = req.body;
  console.log(updatedData)

  try {
   await connection.query('UPDATE CandidSpont SET ? WHERE id = ?', [updatedData, resourceId], async function (errors, resultats, fields){
      if (errors) {
        console.error(errors);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      else{
        res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
      }
     });
    }catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
});

app.delete("/Annonce/delete/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  try {
    await connection.query('DELETE FROM Annonce WHERE id = ?', [resourceId], async function (errors, resultats, fields){
       if (errors) {
         console.error(errors);
         res.status(500).json({ success: false, message: 'Internal server error' });
       }
       else{
         res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
       }
      });
     }catch (error) {
           console.error(error);
           res.status(500).json({ message: 'Internal Server Error' });
       }
});

app.delete("/Utilisateur/delete/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  try {
    await connection.query('DELETE FROM Utilisateur WHERE id = ?', [resourceId], async function (errors, resultats, fields){
       if (errors) {
         console.error(errors);
         res.status(500).json({ success: false, message: 'Internal server error' });
       }
       else{
         res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
       }
      });
     }catch (error) {
           console.error(error);
           res.status(500).json({ message: 'Internal Server Error' });
       }
});

app.delete("/Entreprise/delete/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  try {
    await connection.query('DELETE FROM Entreprise WHERE id = ?', [resourceId], async function (errors, resultats, fields){
       if (errors) {
         console.error(errors);
         res.status(500).json({ success: false, message: 'Internal server error' });
       }
       else{
         res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
       }
      });
     }catch (error) {
           console.error(error);
           res.status(500).json({ message: 'Internal Server Error' });
       }
});

app.delete("/CandidSpont/delete/:id", async (req,res)=>{
  const resourceId = parseInt(req.params.id);
  try {
    await connection.query('DELETE FROM CandidSpont WHERE id = ?', [resourceId], async function (errors, resultats, fields){
       if (errors) {
         console.error(errors);
         res.status(500).json({ success: false, message: 'Internal server error' });
       }
       else{
         res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
       }
      });
     }catch (error) {
           console.error(error);
           res.status(500).json({ message: 'Internal Server Error' });
       }
});

app.get('/Annonce/get',(req,res) =>{
connection.query("SELECT * FROM Annonce ",(error, results) => {
  if (error) throw error;
  res.json(results);
});

});

app.get('/Utilisateur/get',(req,res) =>{
connection.query("SELECT * FROM Utilisateur ",(error, results) => {
  if (error) throw error;
  res.json(results);
});
});  

app.get('/Entreprise/get',(req,res) =>{
connection.query("SELECT * FROM Entreprise ",(error, results) => {
  if (error) throw error;
  res.json(results);
});

});

app.get('/CandidSpont/get',(req,res) =>{
connection.query("SELECT * FROM CandidSpont ",(error, results) => {
   if (error) throw error;
   res.json(results);
});
  
});  

app.post('/Annonce/post',(req,res)=>{
 let Titre = req.body.Titre;
 let Niveau = req.body.Niveau;
 let Description = req.body.Description;
 let FullDescription = req.body.FullDescription;
 let Horaire = req.body.Horaire;
 let Salaire = req.body.Salaire;
 let id_Entr = req.body.id_Entreprise;

 var form_data = {
  Titre: Titre,
  Description: Description,
  Niveau: Niveau,
  FullDescription: FullDescription,
  Horaire: Horaire,
  Salaire: Salaire,
  id_Entreprise : id_Entr
}
connection.query('INSERT INTO Annonce SET ?',form_data,(err, result) => {
if (err) {
    console.error('Error inserting item:', err.message);
    res.status(500).json({ error: 'Error inserting item' });
} else {
    res.status(200).json({ message: 'Item created successfully' });
}
}
)
});

app.post('/Utilisateur/post',(req,res)=>{
let Nom = req.body.Nom;
let Prenom = req.body.Prenom;
let Email = req.body.Email;
let mdp = req.body.mdp;
let Telephone = req.body.Telephone;
let CV = req.body.CV;
let Roles = req.body.Roles;

var form_data = {
 Nom: Nom,
 Prenom: Prenom,
 Email: Email,
 mdp: mdp,
 Telephone: Telephone,
 CV: CV,
 Roles : Roles
}
connection.query('INSERT INTO Utilisateur SET ?',form_data,(err, result) => {
if (err) {
   console.error('Error inserting item:', err.message);
   res.status(500).json({ error: 'Error inserting item' });
} else {
   res.status(200).json({ message: 'Item created successfully' });
}
}
)

});

app.post('/Entreprise/post',(req,res)=>{
let Nom = req.body.Nom;
let Lieu = req.body.Lieu;
let Domaine = req.body.Domaine;
let Description = req.body.Description;
let Email = req.body.Email;


var form_data = {
 Nom: Nom,
 Lieu: Lieu,
 Domaine: Domaine,
 Description: Description,
 Email: Email
}
connection.query('INSERT INTO Entreprise SET ?',form_data,(err, result) => {
if (err) {
   console.error('Error inserting item:', err.message);
   res.status(500).json({ error: 'Error inserting item' });
} else {
   res.status(200).json({ message: 'Item created successfully' });
}
}
)

});

app.post('/CandidSpont/post',(req,res)=>{
let Nom = req.body.Nom;
let Email = req.body.Email;
let Téléphone = req.body.Téléphone;
let Message = req.body.Message;
let id_Annonce = req.body.id_Annonce;

var form_data = {
 Nom: Nom,
 Email: Email,
 Téléphone: Téléphone,
 Message: Message,
 id_Annonce : id_Annonce
}
connection.query('INSERT INTO CandidSpont SET ?',form_data,(err, result) => {
if (err) {
   console.error('Error inserting item:', err.message);
   res.status(500).json({ error: 'Error inserting item' });
} else {
   res.status(200).json({ message: 'Item created successfully' });
}
}
)

});

app.post('/create-table', async (req, res) => {
  const { tableName, fields } = req.body;
  

  try {
 
      const sanitizedTableName = connection.escapeId(tableName);

      let fieldDefinitions = '';
      for (const fieldName in fields) {
          const sanitizedFieldName = connection.escapeId(fieldName);
          const fieldType = fields[fieldName];
          fieldDefinitions += `${sanitizedFieldName} ${fieldType}, `;
      }

      fieldDefinitions = fieldDefinitions.slice(0, -2);

      await connection.query(`CREATE TABLE IF NOT EXISTS ${sanitizedTableName} (${fieldDefinitions})`);


      res.status(200).json({ message: `Table "${tableName}" created successfully with fields: ${JSON.stringify(fields)}` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }

});

app.post('/post-colonne/:table',async(req,res)=>{
  const table = req.params.table;
  const fields = req.body;
  

  try {
      await connection.query(`INSERT INTO ${table} SET ?`,[fields]);


      res.status(200).json({ message: `Table "${table}" created successfully with fields: ${JSON.stringify(fields)}` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/put-table/:id', async(req,res)=>{
  const { tableName, fields } = req.body;
  const resourceId = parseInt(req.params.id);

  try {
    await connection.query('UPDATE ? SET ? WHERE id = ?', [tableName, fields, resourceId], async function (errors, resultats, fields){
       if (errors) {
         console.error(errors);
         res.status(500).json({ success: false, message: 'Internal server error' });
       }
       else{
         res.status(200).json({ message: `Resource with ID ${resourceId} updated successfully` });
       }
      });
     }catch (error) {
           console.error(error);
           res.status(500).json({ message: 'Internal Server Error' });
       }
   

});

app.delete('/delete-colonne/:table', async(req,res)=>{
  const table = req.params.table;
  const id = parseInt(req.body.id);

try {
  await connection.query(`DELETE FROM ${table} WHERE id = ?`,[id],async function (errors, resultats, fields){
    if (errors) {
      console.error(errors);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
    else{
      res.status(200).json({ message: `Resource with ID ${id} updated successfully` });
    }
   });
  }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}); 

app.delete('/delete-table/:table', async (req,res)=>{
  const table = req.params.table;

  try {
    await connection.query(`DROP TABLE IF EXISTS ${table}`,async function (errors, resultats, fields){
      if (errors) {
        console.error(errors);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
      else{
        res.status(200).json({ message: `${table} succesfully erase` });
      }
     });
    }catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
});

app.get('/rechercher-annonces', (req, res) => {
  const searchTerm = req.query.term;

  const sql = `
    SELECT * FROM Annonce
    WHERE Titre LIKE ? OR Description LIKE ? OR Niveau LIKE ? OR Date LIKE ? OR Horaire LIKE ? OR Salaire LIKE ?;
  `;

  const searchValue = `%${searchTerm}%`;

  connection.query(sql, [
    searchValue,
    searchValue,
    searchValue,
    searchValue,
    searchValue,
    searchValue
  ], (error, results) => {
    if (error) {
      console.error('Erreur de recherche : ' + error.message);
      res.status(500).json({ error: 'Erreur de recherche' });
    } else {
      res.status(200).json({ annonces: results });
    }
  });
});

app.post('/postuler', (req, res) => {
  const candidatId = req.body.candidatId;
  const annonceId = req.body.annonceId; 

  connection.query('SELECT E.Email AS EntrepriseEmail, A.Titre AS AnnonceTitre FROM Entreprise E, Annonce A WHERE A.id = ? AND A.id_Entreprise = E.id', [annonceId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des informations de l\'entreprise :', err);
      res.status(500).send('Erreur lors de la récupération des informations de l\'entreprise.');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Entreprise introuvable');
      return;
    }

    const entreprise = results[0];


    const transporter = nodemailer.createTransport({
      host: 'pro3.mail.ovh.net', 
      port: 587, 
      secure: false, 
      auth: {
        user: 'contact@epitech.fun', 
        pass: 'leftdead1968@FR', 
      },
    });

    connection.query('SELECT CV, Nom, Prenom FROM Utilisateur WHERE id = ?', [candidatId], (err, cvResults) => {
      if (err) {
        console.error('Erreur lors de la récupération du chemin du CV du candidat :', err);
        res.status(500).send('Erreur lors de la récupération du chemin du CV du candidat.');
        return;
      }

      console.log('Résultat de la requête pour le CV du candidat :', cvResults);

      if (cvResults.length === 0) {
        console.log('Aucun CV trouvé pour le candidat');
        res.status(404).send('CV du candidat introuvable');
        return;
      }


      const candidatCVPath = cvResults[0].CV;
      const nomCandidat = cvResults[0].Nom;
      const prenomCandidat = cvResults[0].Prenom;

      const mailOptions = {
        from: '"My Jobboard" <contact@epitech.fun>',
        to: entreprise.EntrepriseEmail,
        subject: `Candidature pour l'annonce ${entreprise.AnnonceTitre}`,
        text: `Chère équipe de ${entreprise.AnnonceTitre},\n\n
        Nous sommes ravis de vous informer qu'une nouvelle candidature a été soumise pour l'annonce ${entreprise.AnnonceTitre}.
        Vous trouverez le CV du candidat en pièce jointe à cet e-mail.
        \n
        Nom du candidat : ${nomCandidat} ${prenomCandidat}
        \n
        Nous vous remercions de l'attention que vous porterez à cette candidature. Si vous avez des questions ou si vous souhaitez planifier une entrevue, n'hésitez pas à nous contacter.
        \n
        Cordialement,
        Votre équipe My Job Board`,
        attachments: [
          {
            filename: `CV - ${nomCandidat} ${prenomCandidat}.pdf`,
            path: candidatCVPath,
          },
        ],
      };
      

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
          res.status(500).send('Erreur lors de l\'envoi de l\'e-mail.');
        } else {
          console.log('E-mail envoyé :', info.response);
          res.status(200).json({ success: true });
          res.status(200).send('E-mail envoyé avec succès !');
        }
      });
    });
  });
});

app.post('/getRole', async (req, res) => {
  const userId = req.body.userId;

  connection.query('SELECT Roles FROM Utilisateur WHERE id = ?', userId, (errors, results) => {
    if (errors) {
      console.error(errors);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    } else if (results.length > 0) {
      const userRole = results[0].Roles;
      res.json({ success: true, role: userRole });
    } else {
      res.status(404).json({ success: false, message: 'ID utilisateur non trouvé' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});