import { LightningElement, track } from "lwc";
export default class SimpleCalculatorLWC extends LightningElement {
    @track currentResult;
	@track resultHistory = [];
	@track showPreviousResult = false;

	fValue;
	svalue;	

	handleInputEnter(event) {
		const targetName = event.target.name;
		if (targetName === "fNumber") {
            this.fValue = parseInt(event.target.value);
		} else if (targetName === "sNumber") {
			this.sValue = parseInt(event.target.value);
		}
	}

	handleAdd() {
		//this.currentResult = this.fValue + this.sValue;
		this.currentResult = `Result of : ${this.fValue}+${this.sValue} = ${this.fValue + this.sValue}`;
		this.resultHistory.push(this.currentResult);
	}

	handleSub() {
		//this.currentResult = this.fValue - this.sValue;
		this.currentResult = `Result of : ${this.fValue}-${this.sValue} = ${this.fValue - this.sValue}`;
		this.resultHistory.push(this.currentResult);
	}

	handleMul() {
		//this.currentResult = this.fValue * this.sValue;
		this.currentResult = `Result of : ${this.fValue}x${this.sValue} = ${this.fValue * this.sValue}`;
		this.resultHistory.push(this.currentResult);
	}

	handleDiv() {
		//this.currentResult = this.fValue / this.sValue;
		this.currentResult = `Result of : ${this.fValue}/${this.sValue} = ${this.fValue / this.sValue}`;
		this.resultHistory.push(this.currentResult);
	}

	showPreviousResultToggle(event){
		this.showPreviousResult = event.target.checked;
	}
}