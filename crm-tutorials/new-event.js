{
    "id": "new-event",
    "url": "civicrm/event/add",
    "auto_run": false,
    "steps": [
        {
            "target": "#EventInfo  .crm-event-manage-eventinfo-form-block-event_type_id",
            "title": ts("What kind of event is it?"),
            "placement": "bottom",
            "content": ts("Start by choosing the type of event you are planning"),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#EventInfo  .crm-event-manage-eventinfo-form-block-default_role_id",
            "title": ts("Who will be booking on to the event?"),
            "placement": "bottom",
            "content": ts("This allows you to choose what the default is for participants when they book on. The most common default is 'attendee'."),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#EventInfo  .crm-event-manage-eventinfo-form-block-participant_listing_id",
            "title": ts("Participant Listing"),
            "placement": "bottom",
            "content": ts("This enables you to publish the list of attendees if you are organising a high profile event. Usually, you will want this to be <strong>disabled</strong>."),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#title",
            "title": ts("Title"),
            "placement": "bottom",
            "content": ts("This is the public title for your event"),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#summary",
            "title": ts("The Summary"),
            "placement": "bottom",
            "content": ts("This will be displayed alongside the description below. If you use an RSS feed or a View, for example, you may restrict the display to the summary"),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#cke_1_contents  .cke_wysiwyg_frame.cke_reset",
            "title": ts("Add a full description"),
            "placement": "bottom",
            "content": ts("This is where you can add a full description and use all the formatting options"),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#start_date_display_5bbdf673d4331",
            "title": ts("Dates"),
            "placement": "bottom",
            "content": ts("Make sure you complete start <strong>and</strong> end dates, otherwise the event will continue to be current"),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#max_participants",
            "title": ts("Manage your waiting list"),
            "placement": "bottom",
            "content": ts("If you specify a maximum here, this will enable the waiting list option and you can control the message that goes out when it's full"),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#is_map",
            "title": ts("Additional Options"),
            "placement": "left",
            "content": ts("Towards the bottom here, you have some more options to add a map, choose whether it is active or inactive, public or hidden, and whether there are options to share the event with shortcuts on social media"),
            "icon": "",
            "isRtl": ""
        },
        {
            "target": "#_qf_EventInfo_upload-bottom",
            "title": ts("And finally..."),
            "placement": "bottom",
            "content": ts("When you click on Continue, this will save the event and then allow you to add extras, such as the address, online booking, payments, or add linked events."),
            "icon": "",
            "isRtl": ""
        }
    ],
    "groups": []
}
