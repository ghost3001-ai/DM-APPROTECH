# Intégration du formulaire Brevo avec Redirection terminée

L'intégration a été mise à jour avec le nouveau code de formulaire (largeur 350px) et une page de redirection automatique a été ajoutée.

## Changements effectués

### 1. Mise à jour de [index.html](file:///C:/Users/HP/Desktop/A/Nouveau%20dossier/DM%20APPROTECH/index.html)
- **Nouveau Code** : Utilisation de la version du formulaire Brevo avec un en-tête "DM APPROTECH" et une largeur de 350px pour mieux s'intégrer dans la fenêtre modale.

### 2. Création de [merci.html](file:///C:/Users/HP/Desktop/A/Nouveau%20dossier/DM%20APPROTECH/merci.html)
- **Page de confirmation** : Une nouvelle page dédiée aux remerciements a été créée. Elle reprend la charte graphique du site (couleurs, logo, polices) pour une expérience utilisateur fluide.

### 3. Logique de redirection dans [js/script.js](file:///C:/Users/HP/Desktop/A/Nouveau%20dossier/DM%20APPROTECH/js/script.js)
- **Redirection Automatique** : J'ai ajouté un script qui surveille l'apparition du message de succès de Brevo. Dès que le message "Votre demande d'audit a été enregistré avec succès" apparaît, l'utilisateur est automatiquement redirigé vers `merci.html` après un délai de 2 secondes.

## Vérification

1. Ouvrez [index.html](file:///C:/Users/HP/Desktop/A/Nouveau%20dossier/DM%20APPROTECH/index.html).
2. Ouvrez la modal d'audit et remplissez le formulaire.
3. Après l'envoi, vérifiez que le message de succès s'affiche, puis que la page change automatiquement vers **merci.html**.

> [!TIP]
> Pour une intégration encore plus robuste, vous pouvez également configurer l'URL de redirection directement dans les paramètres de votre formulaire sur le tableau de bord Brevo en indiquant le lien vers `merci.html`.
