const net = require("net");
const fs = require("fs");
const path = require("path");

// Dossier contenant les images
const imagesFolder = "./";
console.log(imagesFolder);
// Informations du serveur
const serverHost = "192.168.3.132"; // Remplacez par l'adresse IP de votre serveur
const serverPort = 80; // Remplacez par le port de votre serveur

// Création du client TCP
const client = new net.Socket();

// Connexion au serveur
client.connect(serverPort, serverHost, () => {
  console.log("Connecté au serveur");

  //   setTimeout(()=>{console.log("let's go");},4000)
  // Lire le contenu du dossier d'images
  fs.readdir(imagesFolder, (err, files) => {
    if (err) {
      console.error("Erreur lors de la lecture du dossier", err);
      client.end();
      return;
    }

    // Filtrer pour ne garder que les fichiers images
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|tga)$/i.test(file)
    );
    console.log(imageFiles);
    // Envoyer chaque image au serveur
    imageFiles.forEach((file, index) => {
      const filePath = path.join(imagesFolder, file);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error("Erreur lors de la lecture du fichier", err);
        } else {
          const header =
            JSON.stringify({
              action: "imageEsp",
              filename: file,
              size: data.length,
              id: "1",
              date: "10/02/2024 22h30",
            }) + "\n";
          client.write(header);
          client.write(data);
          console.log(data);
        }
      });
    });
  });
});

// Gestion de la fermeture de la connexion
client.on("close", () => {
  console.log("Connexion fermée");
});

// Gestion des erreurs
client.on("error", (err) => {
  console.error("Erreur de connexion", err);
});
