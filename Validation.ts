// Dokument�cia:

//  Pripojenie:
//    Na <input/> nastav data-validation="true" a data-validation-group="{{n�zov grupy inputs & buttons}}".
//    Daleje je nutne prida� data-validation-group="{{n�zov gr�py}}" aspon pre jeden <button></button>.
//    Do <body></body> pridaj <div data-validation-for="{{id validovan�ho inputu}}"></div> a v tvojom main.js s�bore, 
//    vytvor instanciu Validation.ts(sta�� jedena na cel� page) a zavolaj initialize().

//  Ako to funguje:
//    Po spusteni initialize() sa skontroluje ci na stranke existuje aspon jeden element z atributon data-validation="true".
//    Ak �no, tak sa skontroluje validita nastaven�(ka�d� input musi byt v grupe z aspon jednim buttnom) a ak je vsetko v poriadku,
//    tak pre kazdy input sa nastavy event change. Pri odpaleni eventu sa skontroluje validita inputu(cez prehliadac a klasicke HTML atributy)
//    a podla vysledku sa zobraz� v tele DIVu pre feedback odpovedajuca hl�ka(dodana prehliadacom) + button grupy sa bud zablokuje alebo spr�stupn pre akciu(disabled).

class Validation {
  private readonly ENV_DATA_VALIDATION_GROUP = 'data-validation-group';
  private readonly ENV_IS_VALID = 'is-valid';
  private readonly ENV_IS_INVALID = 'is-invalid';
  private readonly ENV_VALID_FEEDBACK = 'valid-feedback';
  private readonly ENV_INVALID_FEEDBACK = 'invalid-feedback';

  private _groupNames: string[] = [];

  private _getInputsForGroupName(groupName: string): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll(`input[${this.ENV_DATA_VALIDATION_GROUP}="${groupName}"]`) as NodeListOf<HTMLInputElement>;
  }
  private _getButtonsForGroupName(groupName: string): NodeListOf<HTMLButtonElement> {
    return document.querySelectorAll(`button[${this.ENV_DATA_VALIDATION_GROUP}="${groupName}"]`) as NodeListOf<HTMLButtonElement>;
  }


  initialize(): void {
    const getAllGroupNames = (): string[] => {
      let result: string[] = [];

      const inputs = document.querySelectorAll(`input[${this.ENV_DATA_VALIDATION_GROUP}]`) as NodeListOf<HTMLInputElement>;
      inputs.forEach(input => result.push(input.getAttribute(this.ENV_DATA_VALIDATION_GROUP)));

      const buttons = document.querySelectorAll(`button[${this.ENV_DATA_VALIDATION_GROUP}]`) as NodeListOf<HTMLButtonElement>;
      buttons.forEach(button => result.push(button.getAttribute(this.ENV_DATA_VALIDATION_GROUP)));

      return [...new Set(result)];
    };
    const noInputForValidation = (): boolean => {
      const inputsForValidation = document.querySelectorAll('input[data-validation="true"]') as NodeListOf<HTMLInputElement>;
      return inputsForValidation?.length === 0;
    };
    const anyInvalidOptions = (groupNames: string[]): boolean => {
      const isGroupInvalid = (groupName: string): boolean => {
        return this._getInputsForGroupName(groupName)?.length === 0 || this._getButtonsForGroupName(groupName)?.length === 0;
      };

      groupNames.forEach(groupName => {
        if (isGroupInvalid(groupName)) {
          console.error(`Group with name ${groupName} is invalid.`);
          return true;
        }
      });

      return false;
    }
    const setEvents = (groupNames: string[]): void => {
      const setInputValidation = (input: HTMLInputElement, isValid: boolean): void => {
        input.classList.add(isValid ? this.ENV_IS_VALID : this.ENV_IS_INVALID);
        input.classList.remove(isValid ? this.ENV_IS_INVALID : this.ENV_IS_VALID);
      };
      const setButtonsValidation = (buttons: NodeListOf<HTMLButtonElement>, disabled: boolean): void => {
        buttons.forEach(button => button.disabled = disabled);
      };
      const setTextMessages = (containers: NodeListOf<HTMLDivElement>, isValid: boolean, message: string): void => {
        containers.forEach(container => {
          container.innerText = message;
          container.classList.add(isValid ? this.ENV_VALID_FEEDBACK : this.ENV_INVALID_FEEDBACK);
          container.classList.remove(isValid ? this.ENV_INVALID_FEEDBACK : this.ENV_VALID_FEEDBACK);
        });
      };
      const isAllInputValid = (groupName: string): boolean => {
        let isValid = true;

        this._getInputsForGroupName(groupName).forEach(input => {
          if (!input.checkValidity())
            isValid = false;
        });

        return isValid;
      };

      groupNames.forEach(groupName => {
        const inputs = this._getInputsForGroupName(groupName);
        inputs.forEach(input => {
          input.addEventListener('input', (ev: Event) => {
            setInputValidation(input, input.checkValidity());
            setButtonsValidation(this._getButtonsForGroupName(groupName), !isAllInputValid(groupName));
            setTextMessages(document.querySelectorAll(`div[data-validation-for="${input.id}"]`) as NodeListOf<HTMLDivElement>, input.checkValidity(), input.validationMessage);
          });
        });
      });
    };

    if (noInputForValidation())
      return null;

    this._groupNames = getAllGroupNames();
    if (anyInvalidOptions(this._groupNames))
      return null;

    setEvents(this._groupNames);
  }
}