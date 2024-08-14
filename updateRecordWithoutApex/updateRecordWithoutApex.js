import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const FIELDS = ['Contact.Account.Name', 'Contact.Account.Phone', 'Contact.AccountId']
export default class UpdateRecordWithoutApex extends LightningElement {
    @api recordId;
    @track accountId;
    @track name;
    @track phone;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
            this.showToastEvent('Error fetching record', error.body.message, 'error');
        } else if (data) {
            this.accountId = data.fields.AccountId.value;;
            this.name = data.fields.Account.value.fields.Name.value;
            this.phone = data.fields.Account.value.fields.Phone.value;
        }
    }
    handlechange(event) {
        if (event.target.name === 'name') {
            this.name = event.target.value;
        } else {
            this.phone = event.target.value;
        }
    }
    handleClick() {
        const fields = {
            Id: this.accountId,
            Name: this.name,
            Phone: this.phone
        };
        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                this.showToastEvent('Success', 'Account updated ' + this.name, 'success');
            })
            .catch(error => {
                this.showToastEvent('Error updating record', error.body.message, 'error');
            });
    }
    showToastEvent(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}