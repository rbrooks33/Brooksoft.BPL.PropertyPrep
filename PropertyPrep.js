Apps.Define([], function () {
    var Me = {
        Initialize: function (callback) {
            callback();
        },
        Model: {
            Schedule: [],
            ScheduleItem: {
                Person: '',
                Location: '',
                Task: '',
                Start: '',
                End: ''
            }
        },
        ID: 0,
        Init: function () {

            $('#contentDebug').hide();

            Apps.Components.BPL.Shared.GetInstance(1, function (result) {

                Me.RenderHome();
                Me.RenderTable();
                Me.RenderInput();

            });


            //Apps.Components.BPL.Shared.NewInstance(Me, function (result) {
            //    Apps.Notify('info', 'new id: ' + result.ID);
            //    Me.ID = result.ID;
            //    Apps.Components.BPL.Shared.SaveInstance(Me.ID, Me.Model);

            //    Apps.Components.BPL.Shared.GetInstance(Me.ID, function () {

            //        Me.RenderHome();
            //        Me.RenderTable();

            //    })

          //  });

        },
        RenderHome: function () {
            var html = Apps.Templates.Clone('PropertyPrepHome');
            $('#PropertyPrepContainer').html(html);


        },
        RenderTable: function () {
            var html = Apps.Templates.Clone('PropertyPrepTable');
            $('.schedule-placeholder').html(html);
        },
        RenderInput: function () {
            var html = Apps.Templates.Clone('PropertyPrepInput');
            $('.property-prep-input-container').html(html);
        },
        AddScheduleItem: function () {

                var input = $('#inputPrompt').val().trim();
                if (input) {
                    $('#inputResult').text('🧠 Thinking...');

                    let system = Apps.Templates.Clone('DerivationPrompt').text();
                    let user = input;

                    Apps.Execute('AI.Submit', [
                        { Name: 'User', Value: user },
                        { Name: 'System', Value: system }
                    ], function (result) {
                        let data = JSON.parse(result.Data);
                        let message = data.choices[0].message.content;
                        let scheduleItem = JSON.parse(message);


                        scheduleItem[0].Start = Me.ToDateTimeLocalString(scheduleItem[0].Start);
                        scheduleItem[0].End = Me.ToDateTimeLocalString(scheduleItem[0].End);

                        let rowHtml = Apps.Templates.Clone('PropertyPrepRow', scheduleItem[0])

                       // $('#inputResult').html(message);

                        $('#prep-rows').append(rowHtml);
                    });
                    // Placeholder for AI call – simulate for now
                //    setTimeout(function () {
                //        $('#inputResult').html('<pre>{ "Person": "Emily", "Location": "Oak Street", "Task": "Clean kitchen", "EstimatedTime": 2, "DueDate": "2025-05-19" }</pre>');
                //    }, 800);
                }

        },
        ToDateTimeLocalString: function (fuzzyString) {
            // Convert "06-09-2024 5 PM" → "2024-06-09T17:00"
            try {
                const match = fuzzyString.match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
                if (!match) return '';

                let [, month, day, year, hour, minute = '00', ampm] = match;
                hour = parseInt(hour, 10);
                if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
                if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;

                return `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minute}`;
            } catch {
                return '';
            }        }

    };
    return Me;
});