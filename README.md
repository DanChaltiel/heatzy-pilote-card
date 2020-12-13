# Heatzy Pilote Card
[![HACS Supported](https://img.shields.io/badge/HACS-Not_Supported-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)


Cette card est basée sur l'intégration de [Devotics](https://github.com/Devotics/heatzy-home-hassistant).

# Installation

Copier `heatzy-pilote-card.js` dans `config/www/community/heatzy-pilote-card` (créer le dossier si besoin). Ensuite, dans `config.yaml`, ajouter un module de ressources comme ceci:

```yaml
lovelace:
  mode: yaml
  resources:
    - url: /hacsfiles/heatzy-pilote-card/heatzy-pilote-card.js
      type: module
```

Intégration à HACS à venir.
Tuto en français : https://hacf.fr/installer-ajouter-integrations-customisations-avec-hacs/

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
type: 'custom:heatzy-pilote-card'
title: Mes chauffages
language: fr
elements:
  - entity: climate.bureau
    temp_sensor: sensor.temperature_bureau
    friendly_name: Le Bureau
```

![image](https://user-images.githubusercontent.com/15105152/102015208-7b4e1d80-3d5a-11eb-97f1-5b79b32d4da6.png)


