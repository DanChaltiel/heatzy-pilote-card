# Heatzy Pilote Card
[![HACS Supported](https://img.shields.io/badge/HACS-Not_Supported-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)


Cette card est basée sur l'intégration de [Cyr-ius](https://github.com/Cyr-ius/hass-heatzy)

# Ce qu'apporte ce fork

- Compatibilité rétablie avec l'intégration de Cyr-ius suite aux modifications introduites avec la v5.8.3 du 25/10/2023.

- Gestion des profils "mode clair" ou "mode sombre" de Home Assistant et adaptation des couleurs en fonction du profil en cours d'utilisation.

- Adaptation du choix des icônes et des couleurs afin de ressembler davantage à l'application officielle heatzy.

| Light mode       | Dark mode   | 
| ---------- | ------ |
| ![image](https://github.com/luke7101/heatzy-pilote-card/assets/58976540/e4106ff2-c398-4e55-a047-58b646473269)     | ![image](https://github.com/luke7101/heatzy-pilote-card/assets/58976540/c1d26695-07cc-4d59-8086-3e655fa1a93c) |


# Installation

Copiez `heatzy-pilote-card.js` dans `config/www/community/heatzy-pilote-card` (créer le dossier si besoin), ensuite ajoutez la ressource dans Home Assitant.
Rendez-vous [ici](https://my.home-assistant.io/redirect/lovelace_dashboards/) pour ouvrir la configuration des tableaux de bord et cliquez sur les trois petits point en hauit à droite et cliquez "Ressources".
Sur cette page vous pouvez ajouter une nouvelle ressource en cliquant sur le bouton "Ajouter ressource", il faudra ensuite spécifier l'URL `/local/community/heatzy-pilote-card/heatzy-pilote-card.js?v=2.0.0` et le type de ressource "Javascript".

Annotation:
A chaque fois que vous voulez remplacer ou mettre à jour le fichier heatzy-pilote-card.js il vous faudra incrementer le numéro de version spécifié dans l'URL de la ressource afin qu'Home Assistant le prenne en compte ex: `/local/community/heatzy-pilote-card/heatzy-pilote-card.js?v=2.0.1`


# Configuration de la carte

### Main Options

| Name       | Type   | Default      | Supported options           | Description |
| ---------- | ------ | ------------ | --------------------------- | ----------------------------------- |
| `type`     | string | **Required** | `custom:heatzy-pilote-card` | Type of the card  |
| `title`    | string | optional     | none                        | Optional title in the header  |
| `language` | string | EN           | EN\|FR                      | Language  |
| `elements` | array  | **Required** | none                        | List of elements 


### Options for Elements

| Name | Type | Default | Supported options | Description |
| ---------- | ------ | ------------ | --------------------------- | ----------------------------------- |
| `entity`| string | **Required** | none | A `climate` entity, likely from [Devotics](https://github.com/Devotics/heatzy-home-hassistant) integration |
| `friendly_name`| string | optional | the ID of the entity, minus `climate.`, capitalized | Name of the entity  |
| `temp_sensor`| string | optional | none | Optional sensor to display the temperature of the room 


### Example 

```yaml
type: custom:heatzy-pilote-card
title: Mes chauffages
language: fr
elements:
  - entity: climate.rad_bureau
    temp_sensor: sensor.bureau_temperature
    friendly_name: Bureau
```
