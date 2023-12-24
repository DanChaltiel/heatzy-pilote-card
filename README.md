# Heatzy Pilote Card

[![HACS Supported](https://img.shields.io/badge/HACS-Not_Supported-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

Cette card est basée sur l'intégration de [Cyr-ius](https://github.com/Cyr-ius/hass-heatzy)

## Installation

Copiez `heatzy-pilote-card.js` dans `config/www/community/heatzy-pilote-card` (créer le dossier si besoin), ensuite ajoutez la ressource dans Home Assistant.
Rendez-vous [ici](https://my.home-assistant.io/redirect/lovelace_dashboards/) pour ouvrir la configuration des tableaux de bord et cliquez sur les trois petits points en haut à droite et cliquez "Ressources".
Sur cette page vous pouvez ajouter une nouvelle ressource en cliquant sur le bouton "Ajouter ressource", il faudra ensuite spécifier l'URL `/local/community/heatzy-pilote-card/heatzy-pilote-card.js?v=2.0.0` et le type de ressource "Javascript".

Remarque :
A chaque fois que vous voulez remplacer ou mettre à jour le fichier heatzy-pilote-card.js il vous faudra incrémenter le numéro de version spécifié dans l'URL de la ressource afin qu'Home Assistant le prenne en compte ex : `/local/community/heatzy-pilote-card/heatzy-pilote-card.js?v=2.0.1`

## Configuration de la carte

### Main Options

| Name       | Type   | Default      | Supported options           | Description                  |
|------------|--------|--------------|-----------------------------|------------------------------|
| `type`     | string | **Required** | `custom:heatzy-pilote-card` | Type of the card             |
| `title`    | string | optional     | none                        | Optional title in the header |
| `language` | string | EN           | EN\|FR                      | Language                     |
| `elements` | array  | **Required** | none                        | List of elements

### Options for Elements

| Name            | Type   | Default      | Supported options   | Description   |
|-----------------|--------|--------------|------------------   |---------------|
| `entity`        | string | **Required** | none                | A `climate` entity, likely from [Devotics](https://github.com/Devotics/heatzy-home-hassistant) integration |
| `friendly_name` | string | optional     | the ID of the entity, minus `climate.`, capitalized | Name of the entity |
| `temp_sensor`   | string | optional     | none                | Optional sensor to display the temperature of the room

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

| Light mode   | Dark mode   |
|--------------|-------------|
| ![image](https://github.com/DanChaltiel/heatzy-pilote-card/assets/15105152/40e6983b-8e69-4363-b77c-6bf92bff9925) | ![image](https://github.com/DanChaltiel/heatzy-pilote-card/assets/15105152/7ff3578e-ad1b-4008-ae25-b2225fb1d66a) |
