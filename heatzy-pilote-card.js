
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

const translation = {
  en: {
    modes: {
      "none": "Off",
      "away": "Away",
      "eco": "Eco",
      "comfort": "Comfort"
    },
    hvacmodes: {
      "auto": "Sched",
      "off": "Off",
      "heat": "On"
    }
  },
  fr: {
    modes: {
      "none": "Off",
      "away": "Hors-gel",
      "eco": "Eco",
      "comfort": "Confort"
    },
    hvacmodes: {
      "auto": "Prog",
      "off": "Off",
      "heat": "On"
    }
  }
};

const MODES = [ // https://cdn.materialdesignicons.com/7.1.96/
  { name: "none", icon: "mdi:minus-circle", style: "heat_selected_none" },
  { name: "comfort", icon: "mdi:white-balance-sunny", style: "heat_selected_comfort" },
  { name: "eco", icon: "mdi:weather-night", style: "heat_selected_eco" },
  { name: "away", icon: "mdi:snowflake", style: "heat_selected_away" }
];

const HVACMODES = [ // https://cdn.materialdesignicons.com/7.1.96/
  { name: "off", icon: "mdi:minus-circle", style: "heat_selected_none" },
  { name: "comfort", icon: "mdi:white-balance-sunny", style: "heat_selected_comfort" },
  { name: "eco", icon: "mdi:weather-night", style: "heat_selected_eco" },
  { name: "away", icon: "mdi:snowflake", style: "heat_selected_away" }
];

// heat modes for darkMode
const MODES_dark = MODES.map(({ ...x }) => { x.style = x.style + "_dark"; return x })
const HVACMODES_dark = HVACMODES.map(({ ...x }) => { x.style = x.style + "_dark"; return x })


class HeatzyPiloteCard extends LitElement {

  render() {
    return html`
        <ha-card>
            ${this._getTitle()}           
            ${this._getWarnings()}
            <div class="content has-header">
                ${this._getContent()}
            </div>
        </ha-card>
    `;
  }

  _getTitle() {
    if (this.config.title) {
      return html`<h2 class="card-header">${this.config.title}</h2>`;
    }
    return html``;
  }

  _getContent() {
    return this.config.elements.map(elt => {
      const darkMode = this.hass.themes.darkMode;
      const ent = elt.entity;
      const name = elt.friendly_name ? elt.friendly_name : this._inferName(ent);
      const temp = this._getTemperature(elt.temp_sensor, 1);
      const stateObj = this.hass.states[ent];
      const hvac_mode = stateObj.state // off, auto, heat
      const hvac_action = stateObj.attributes.hvac_action; // off, heating
      const preset_mode = stateObj.attributes.preset_mode; // (null), comfort, eco, away
      const preset_mode_tr = this._getPresetModeTranslation(preset_mode);
      const hvac_mode_tr = this._getHvacModeTranslation(hvac_mode);

      let translation;
      let modeList;
      let modeSelected;
      if (hvac_mode != 'off') {
        translation = hvac_mode_tr;
        modeList = darkMode ? MODES_dark : MODES;
        modeSelected = preset_mode;
      } else {
        translation = preset_mode_tr;
        modeList = darkMode ? HVACMODES_dark : HVACMODES;
        modeSelected = hvac_mode;
      };
      return stateObj ?
        html`<div class="state">      
          <h4 class="heat_name">${name} ${temp}</h4>    
          <span class="heat_icon_list">
          ${translation} ${this._getIconList(modeList, modeSelected, stateObj.entity_id)}
          </span>
        </div>`:
        html`<div class="not-found">Entity '${ent}' not found.</div>`;
    });
  }

  _getIconList(modes_list, mode_selected, entity_id) {
    return modes_list.map(x => {
      const darkMode = this.hass.themes.darkMode;
      x.heat_class = x.name == mode_selected ? 'heat_selected' : '';
      const classSelected = x.name == mode_selected ? x.style : x.heat_class;
      const classDark = darkMode ? "heat_icon_dark" : "heat_icon";

      const xx = html`<ha-icon class="${classDark} ${classSelected}" icon="${x.icon}" 
      @click="${e => this._handleClick(entity_id, x.name)}"></ha-icon>`;
      return (xx);
    });
  }

  _getPresetModeTranslation(preset_mode) {
    const language = this.config.language;
    return translation[language].modes[preset_mode];
  }

  _getHvacModeTranslation(hvac_mode) {
    const language = this.config.language;
    return translation[language].hvacmodes[hvac_mode];
  }

  _inferName(x) {
    x = x.replace("climate.", "");
    return x.charAt(0).toUpperCase() + x.slice(1);
  }


  _getTemperature(sensor, digits) {
    const temp = this.hass.states[sensor];
    if (sensor != undefined && temp == undefined) { //sensor in unknown
      return (html`(?°C)`);
    }

    if (sensor) {
      const temperature = parseFloat(temp.state).toFixed(digits);
      return (html`(${temperature}${temp.attributes.unit_of_measurement})`);
    }
    return (html``);
  }


  _handleClick(entity_id, clicked_mode) {
    if (clicked_mode == 'none') {
      this.hass.callService('climate', 'set_hvac_mode', {
        entity_id: entity_id,
        hvac_mode: 'off'
      });
    }
    else {
      this.hass.callService('climate', 'set_preset_mode', {
        entity_id: entity_id,
        preset_mode: clicked_mode
      });
    }
  }


  _getWarnings() {
    const elts = this.config.elements

    //check: entity is a climate with a "preset mode" attribute / ajouté si hvac_action off
    for (let i = 0; i < elts.length; i++) {
      const elt = elts[i];
      const entity = this.hass.states[elt.entity];
      if (entity.attributes.hvac_action != 'off') {
        if (entity.attributes.preset_mode == undefined) {
          const name = elt.friendly_name ? html`("${elt.friendly_name}") ` : html``;
          return html`<hui-warning>Entity "${elt.entity}" of element #${i + 1} ${name}is not a climate entity with a "preset_mode" attribute</hui-warning>`;
        };
      }
    }

    //check: temperature sensor is not unknown
    for (let i = 0; i < elts.length; i++) {
      const elt = elts[i];
      const temp = this.hass.states[elt.temp_sensor];
      if (elt.temp_sensor != undefined && temp == undefined) {
        const name = elt.friendly_name ? html`("${elt.friendly_name}") ` : html``;
        return html`<hui-warning>Sensor "${elt.temp_sensor}" of element #${i + 1} ${name}is unknown</hui-warning>`;
      }
    }

    return html``;
  }

  setConfig(config) {
    //elements must be defined
    if (!config.elements) {
      throw new Error("You need to define elements");
    }

    //each element must have an entity
    for (let i = 0; i < config.elements.length; i++) {
      const elt = config.elements[i];
      if (!elt.entity) {
        throw new Error("You need to define a climate entity for element #" + i);
      }
    }

    //translation is supported
    if (config.language == undefined) {
      config.language = "en"
    } else if (translation[config.language] == undefined) {
      throw new Error(`Supported languages are only ["en", "fr"]. "${config.language}" is not a supported language.`);
    }

    this.config = config;
  }

  getCardSize() {
    return this.config.elements.length + 1;
  }

  // CSS styles for light/dark modes  
  static get styles() {
    return css`
        .state {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            align-items: center;
        }

        .state h1 {
            margin:0;
            margin-left:25px;
        }
        
        .state h2 {
            margin:0;
            margin-left:25px;
        }
        
        .state h3 {
            margin:0;
            margin-left:15px;
        }
        
        .state h4 {
            margin:0;
            margin-left:15px;
        }

        .heat_icon_list {
            float:right;
        }
        .card-header {
            padding-bottom: 5px;
        }
        .has-header {
            padding-top: 0px;
        }
        .content {
            padding: 16px;
            padding-top: 0;
        }
        .heat_selected{
            color: green !important;
        }
        .heat_selected_none{
            color: #003333 !important;
        }
        .heat_selected_away{
            color: #3366CC !important;
        }
        .heat_selected_eco{
            color: #003333 !important;
        }
        .heat_selected_comfort{
            color: #CC3333 !important;
        }
        .heat_selected_none_dark{
            color: #cecece !important;
        }
        .heat_selected_away_dark{
            color: #488FC2 !important;
        }
        .heat_selected_eco_dark{
            color: #0F9D58 !important;
        }
        .heat_selected_comfort_dark{
            color: #CC3333 !important;
        }
        .heat_icon{
            color: #CCCCCC;
            cursor: pointer;
            margin-left: 10px;
        }
        .heat_icon_dark{
            color: #6F6F6F;
            cursor: pointer;
            margin-left: 10px;
        }
    `;
  }

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }
}

customElements.define('heatzy-pilote-card', HeatzyPiloteCard);
