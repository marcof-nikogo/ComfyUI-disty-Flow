class ToggleComponent {
    constructor(config, workflow) {
        this.container = document.getElementById(config.id);
        if (!this.container) {
            console.error("Container not found:", config.id);
            return;
        }

        this.config = {
            label: '',
            defaultValue: false,
            labelPosition: 'left',
            labelIconOn: '',
            labelIconOff: '',
            ...config
        };
        this.workflow = workflow;
        this.value = typeof this.config.defaultValue === "boolean" 
            ? (this.config.defaultValue ? 1 : 0) 
            : (this.config.defaultValue === "true" ? 1 : 0);

        console.log("ToggleComponent", this.value, this.config.id, this.config.defaultValue);

        this.buildUI();
        this.initializeUI();
    }

    buildUI() {
        const toggleId = `${this.config.id}Toggle`;

        const html = `
            <div class="toggle-component-wrapper">
                ${this.config.labelPosition === 'left' ? this.getLabelHTML() : ''}
                <div class="toggle-component">
                    <input 
                        id="${toggleId}" 
                        class="toggle" 
                        type="checkbox" 
                        role="switch" 
                        name="toggle" 
                        value="on" 
                        ${this.value ? 'checked' : ''}
                        aria-checked="${this.value}"
                    >
                    <label for="${toggleId}" class="slot">
                        <span class="slot__label">OFF</span>
                        <span class="slot__label">ON</span>
                    </label>
                    <div class="curtain"></div>
                </div>
                ${this.config.labelPosition === 'right' ? this.getLabelHTML() : ''}
            </div>
        `;
        this.container.innerHTML = html;

        this.inputElement = this.container.querySelector(`#${toggleId}`);
        this.labelElement = this.container.querySelector('.toggle-label-container');

        this.attachEventListeners();
    }

    getLabelHTML() {
        return `
            <div class="toggle-label-container">
                ${this.config.labelIconOff ? `<img src="${this.config.labelIconOff}" alt="Off Icon" class="toggle-icon off-icon">` : ''}
                <span class="toggle-label">${this.config.label}</span>
                ${this.config.labelIconOn ? `<img src="${this.config.labelIconOn}" alt="On Icon" class="toggle-icon on-icon">` : ''}
            </div>
        `;
    }

    initializeUI() {
        this.updateDisplay();
        this.updateExternalConfig();
    }

    updateValue(newValue) {
        this.value = newValue ? 1 : 0;
        this.updateDisplay();
        this.updateExternalConfig();
    }

    updateDisplay() {
        if (this.inputElement) {
            this.inputElement.checked = this.value;
        }

        if (this.labelElement) {
            const offIcon = this.labelElement.querySelector('.off-icon');
            const onIcon = this.labelElement.querySelector('.on-icon');
            if (offIcon && onIcon) {
                offIcon.style.display = this.value ? 'none' : 'inline';
                onIcon.style.display = this.value ? 'inline' : 'none';
            }
        }
    }

    updateExternalConfig() {
        if (!this.config.nodePath) {
            console.warn("nodePath is not defined in config for ToggleComponent:", this.config.id);
            return;
        }

        const pathParts = this.config.nodePath.split(".");
        let target = this.workflow;
        for (let i = 0; i < pathParts.length - 1; i++) {
            target = target[pathParts[i]] = target[pathParts[i]] || {};
        }
        target[pathParts[pathParts.length - 1]] = this.value;
    }

    attachEventListeners() {
        if (this.inputElement) {
            this.inputElement.addEventListener('change', (event) => {
                this.updateValue(event.target.checked);
                if (typeof this.config.onChange === 'function') {
                    this.config.onChange(this.value);
                }
            });
        }
    }
}

export default ToggleComponent;
