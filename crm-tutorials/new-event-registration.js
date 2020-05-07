{
    "id": "new-event-registration",
    "url": "civicrm/participant/add",
    "steps": [
        {
            "target": "#Participant  .crm-participant-form-contact-id",
            "title": ts("Start with the name of the Participant"),
            "placement": "bottom",
            "content": ts("Start typing the name and if they're in the database already, their name will pop up. If not, you can click on <em>New Individual</em>."),
            "icon": ""
        },
        {
            "target": "#Participant  .view-value .select2-container",
            "title": ts("Now choose the event"),
            "placement": "bottom",
            "content": ts("Start typing the name of the event and you'll be able to choose from the drop down list."),
            "icon": ""
        },
        {
            "target": "#Participant  .crm-participant-form-block-role_id",
            "title": ts("Check the default settings"),
            "placement": "bottom",
            "content": ts("The <em>Role, Date</em> and <em>Status</em> are automatically prefilled so these just need checking."),
            "icon": ""
        },
        {
            "target": "#source",
            "title": ts("Do you need to record where the registration was collected?"),
            "placement": "bottom",
            "content": "",
            "icon": ""
        },
        {
            "target": "#note",
            "title": ts("Additional information"),
            "placement": "bottom",
            "content": ts("If the event is a paid event, or if the confirmation emails are set up, for example, these options appear after you select the event."),
            "icon": ""
        }
    ],
    "groups": []
}
