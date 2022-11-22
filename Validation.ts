class Validation {
  private readonly ENV_DATA_VALIDATION_GROUP = 'data-validation-group';
  private readonly ENV_IS_VALID = 'is-valid';
  private readonly ENV_IS_INVALID = 'is-invalid';
  private readonly ENV_VALID_FEEDBACK = 'valid-feedback';
  private readonly ENV_INVALID_FEEDBACK = 'invalid-feedback';

  private _groupNames: string[] = [];

  private _getInputsForGroupName(groupName: string): NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    return document.querySelectorAll(`[${this.ENV_DATA_VALIDATION_GROUP}="${groupName}"]:not(button)`) as NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  }

  private _getButtonsForGroupName(groupName: string): NodeListOf<HTMLButtonElement> {
    return document.querySelectorAll(`button[${this.ENV_DATA_VALIDATION_GROUP}="${groupName}"]`) as NodeListOf<HTMLButtonElement>;
  }

  initialize(): void {
    const getAllGroupNames = (): string[] => {
      let result: string[] = [];

      const elements = document.querySelectorAll(`input[${this.ENV_DATA_VALIDATION_GROUP}]`) as NodeListOf<HTMLElement>;
      elements.forEach(element => result.push(element.getAttribute(this.ENV_DATA_VALIDATION_GROUP)));

      return [...new Set(result)];
    };
    const noInputForValidation = (): boolean => {
      const inputsForValidation = document.querySelectorAll(`[${this.ENV_DATA_VALIDATION_GROUP}]`) as NodeListOf<HTMLInputElement>;
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
      const setInputValidation = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, isValid: boolean): void => {
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
