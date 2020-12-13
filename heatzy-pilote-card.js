
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

const translation = {
  en: {
    modes: {
      "none": "None",
      "away": "Away",
      "eco": "Eco",
      "comfort": "Comfort"
    }
  },
  fr: {
    modes: {
      "none": "Off",
      "away": "Hors-gel",
      "eco": "Eco",
      "comfort": "Confort"
    }
  }
};


const MODES = [ // https://cdn.materialdesignicons.com/5.3.45/
    {name:"none", icon:"mdi:do-not-disturb"}, 
    {name:"away", icon:"mdi:snowflake"},
    {name:"eco", icon:"mdi:leaf"}, 
    {name:"comfort", icon:"mdi:weather-sunny"} 
];

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
    if(this.config.title){
      return html`<h1 class="card-header">${this.config.title}</h1>`;
    }
    return html``;
  }
  
  _getContent(){
    return this.config.elements.map(elt => {
      const ent = elt.entity;
      const name = elt.friendly_name ? elt.friendly_name : this._inferName(ent);
      const temp = this._getTemperature(elt.temp_sensor, 1);
      const stateObj = this.hass.states[ent];
      const preset_mode = stateObj.attributes.preset_mode;
      const preset_mode_tr = this._getPresetModeTranslation(preset_mode);
      return stateObj ?
        html`<div class="state">      
          <h2 class="heat_name">${name} ${temp}</h2>    
          <span class="heat_icon_list">
            ${preset_mode_tr} ${this._getIconList(MODES, preset_mode, stateObj.entity_id)}
          </span>
        </div>`:
        html`<div class="not-found">Entity '${ent}' not found.</div>`;
    });
  }

  _getIconList(modes_list, mode_selected, entity_id){
      return modes_list.map(x => {
          x.heat_class=x.name==mode_selected?'heat_selected':'';
          const xx = html`<ha-icon class="heat_icon ${x.heat_class}" icon="${x.icon}" 
                           @click="${e => this._handleClick(entity_id, x.name)}"></ha-icon>`;
          return(xx);
      });
  }
  
  _getPresetModeTranslation(preset_mode){
    const language = this.config.language;
    return translation[language].modes[preset_mode];
  }
  
  _inferName(x){
    x = x.replace("climate.", "");
    return x.charAt(0).toUpperCase() + x.slice(1); 
  }
  
  
  _getTemperature(sensor, digits){
    const temp = this.hass.states[sensor];
    if(sensor!=undefined && temp==undefined){ //sensor in unknrown
      return(html`(?°C)`);
    }
    
    if(sensor){
      const temperature = parseFloat(temp.state).toFixed(digits);
      return(html`(${temperature}${temp.attributes.unit_of_measurement})`);
    } 
    return(html``);
  }


  _handleClick(entity_id, preset_mode) {
    this.hass.callService('climate', 'set_preset_mode', {
      entity_id: entity_id,
      preset_mode: preset_mode
    });
  }
  
  
  _getWarnings() {    
    const elts = this.config.elements
        
    //check: entity is a climate with a "preset mode" attribute
    for (let i=0; i<elts.length; i++){
      const elt = elts[i];
      const entity = this.hass.states[elt.entity];
      if(entity.attributes.preset_mode==undefined){
        const name = elt.friendly_name? html`("${elt.friendly_name}") ` : html``;
        return html`<hui-warning>Entity "${elt.entity}" of element #${i+1} ${name}is not a climate entity with a "preset_mode" attribute</hui-warning>`;
      }
    }
    
    //check: temperature sensor is not unknown
    for (let i=0; i<elts.length; i++){
      const elt = elts[i];
      const temp = this.hass.states[elt.temp_sensor];
      if(elt.temp_sensor!=undefined && temp==undefined){
        const name = elt.friendly_name? html`("${elt.friendly_name}") ` : html``;
        return html`<hui-warning>Sensor "${elt.temp_sensor}" of element #${i+1} ${name}is unknown</hui-warning>`;
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
    for (let i=0; i<config.elements.length;i++){
      const elt = config.elements[i];
      if (!elt.entity) {
        throw new Error("You need to define a climate entity for element #"+i);
      }
    }    
    
    //translation is supported
    if(config.language == undefined){
      config.language = "en"
    } else if(translation[config.language]==undefined){
      throw new Error(`Supported languages are only ["en", "fr"]. "${config.language}" is not a supported language.`);
    }
    
    this.config = config;
  }

  getCardSize() {
    return this.config.elements.length + 1;
  }
  
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
        .heat_icon{
            color: grey;
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