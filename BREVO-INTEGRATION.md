# Integration Brevo - DM APPROTECH

Ce site est pret pour Brevo, mais la connexion finale demande une information que seul le compte Brevo peut fournir: l'URL publique du formulaire Brevo, de type `https://sibforms.com/serve/...`.

## Option recommandee pour ce site statique

Utiliser un formulaire cree dans Brevo, puis copier son URL publique dans le formulaire du site. Cette methode evite d'exposer une cle API dans le HTML.

Dans `index.html`, remplacer:

```html
action="https://sibforms.com/serve/YOUR_BREVO_FORM_ID"
```

par l'URL publique du formulaire Brevo.

Tu peux aussi utiliser:

```html
data-brevo-endpoint="https://sibforms.com/serve/TON_URL_BREVO"
```

Le JavaScript utilisera `data-brevo-endpoint` en priorite si cette valeur est renseignee.

## Liste a creer dans Brevo

Creer une liste:

```text
Leads - Audit gratuit DM APPROTECH
```

Tous les contacts du formulaire doivent etre ajoutes a cette liste.

## Attributs contact a creer dans Brevo

Creer ces attributs dans Brevo avant d'activer le formulaire. Les noms doivent rester en majuscules.

```text
FIRSTNAME        texte
LASTNAME         texte
SMS              texte / telephone
COMPANY          texte
SITE_CITY        texte
INFRA_TYPE       categorie / texte
POWER_NEED       texte
AUDIT_GOAL       categorie / texte
MESSAGE          texte long
OPT_IN           booleen
LEAD_SOURCE      texte
FUNNEL_STAGE     texte
SERVICE_INTEREST texte
SOURCE_URL       texte
SUBMITTED_AT     texte
UTM_SOURCE       texte
UTM_MEDIUM       texte
UTM_CAMPAIGN     texte
UTM_CONTENT      texte
```

Brevo ignore les attributs qui n'existent pas ou qui ne correspondent pas au type attendu. Il faut donc les creer dans le compte Brevo.

## Formulaire Brevo

Dans Brevo:

1. Aller dans `Contacts > Forms`.
2. Creer un formulaire `Audit gratuit DM APPROTECH`.
3. Ajouter les champs correspondant aux attributs ci-dessus.
4. Associer le formulaire a la liste `Leads - Audit gratuit DM APPROTECH`.
5. Choisir la confirmation:
   - `Simple confirmation` pour ajouter le contact rapidement.
   - `Double opt-in` si tu veux une validation email plus stricte.
6. Dans l'etape de partage, copier le code `Simple HTML` ou l'URL publique.
7. Coller l'URL `https://sibforms.com/serve/...` dans `index.html`.

## Tunnel de vente recommande

Automation Brevo: `Tunnel - Audit gratuit DM APPROTECH`

Declencheur:

```text
Form submitted: Audit gratuit DM APPROTECH
```

Ou, si tu utilises l'API plus tard:

```text
Contact added to list: Leads - Audit gratuit DM APPROTECH
```

Etapes conseillees:

1. Mettre a jour `FUNNEL_STAGE = Nouveau lead`.
2. Envoyer une notification interne a l'equipe commerciale.
3. Envoyer un email de confirmation au prospect:
   - promesse: reponse sous 24h
   - rappel: audit gratuit, diagnostic, ROI, devis
4. Attendre 1 jour.
5. Si le lead n'a pas ete qualifie, envoyer une relance email.
6. Si `INFRA_TYPE = Projet nouveau groupe FG Wilson`, orienter vers une sequence "dimensionnement groupe".
7. Si `INFRA_TYPE = Solaire hybride`, orienter vers une sequence "audit solaire".
8. Creer une tache commerciale:
   - titre: `Appeler - Audit gratuit DM APPROTECH`
   - delai: 24h
9. Creer ou mettre a jour un deal si ton plan Brevo Sales le permet.

## Pourquoi ne pas mettre une cle API Brevo dans ce site

Une cle API placee dans `index.html` ou `js/script.js` serait visible par n'importe quel visiteur. Pour utiliser l'API Brevo, il faut passer par un backend, une fonction serverless, Make, Zapier ou n8n.

## Option API plus tard

Si le site est heberge avec un backend, le flux ideal est:

```text
Formulaire du site
  -> endpoint backend prive
  -> Brevo API /v3/contacts
  -> ajout a la liste
  -> automation Brevo
```

L'API permet d'envoyer `email`, `SMS`, `listIds` et `attributes`. Les attributs doivent etre en majuscules et exister dans le compte Brevo.
