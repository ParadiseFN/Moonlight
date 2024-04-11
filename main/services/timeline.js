const Express = require("express")
const express = Express();
const log = require("../utils/base/log.js")
const functions = require("../utils/functions/functions.js")
const fs = require("fs");
const path = require("path");

express.get("/fortnite/api/calendar/v1/timeline", async (req, res) => {
    var memory = functions.getVersion(req);
    var activeEvents = [
        {
            "eventType": `EventFlag.Season${memory.season}`,
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        },
        {
            "eventType": `EventFlag.${memory.lobby}`,
            "activeUntil": "9999-01-01T00:00:00.000Z",
            "activeSince": "2020-01-01T00:00:00.000Z"
        }
    ];


    if (true) {
        var Events = [
            "EventFlag.Blockbuster2018",
            "EventFlag.Blockbuster2018Phase1",
            "EventFlag.Blockbuster2018Phase2",
            "EventFlag.Blockbuster2018Phase3",
            "EventFlag.Blockbuster2018Phase4",
        ]

        var activeEventsSet = new Set(activeEvents.map(e => e.eventType));
        for (var i = 0; i < Events.length; i++) {
            var Event = Events[i];
            if (!activeEventsSet.has(Event)) {
                activeEvents.push({
                    "eventType": Event,
                    "activeUntil": "9999-01-01T00:00:00.000Z",
                    "activeSince": "2020-01-01T00:00:00.000Z"
                });
            }
        }
    }

    const todayAtMidnight = new Date();
    const dUTC = new Date(Date.UTC(todayAtMidnight.getUTCFullYear(), todayAtMidnight.getUTCMonth(),
        todayAtMidnight.getUTCDate(), 24, 0, 0, 0));
    const todayOneMinuteBeforeMidnight = new Date(dUTC.getTime() - 60000);
    const isoDate = todayOneMinuteBeforeMidnight.toISOString();
    res.json({
        channels: {
            "client-matchmaking": {
                states: [],
                cacheExpire: "9999-01-01T00:00:00.000Z"
            },
            "client-events": {
                states: [{
                    validFrom: "0001-01-01T00:00:00.000Z",
                    activeEvents: activeEvents,
                    state: {
                        activeStorefronts: [],
                        eventNamedWeights: {},
                        seasonNumber: memory.season,
                        seasonTemplateId: `AthenaSeason:athenaseason${memory.season}`,
                        matchXpBonusPoints: 0,
                        seasonBegin: "2020-01-01T00:00:00Z",
                        seasonEnd: "9999-01-01T00:00:00Z",
                        seasonDisplayedEnd: "9999-01-01T00:00:00Z",
                        weeklyStoreEnd: isoDate,
                        stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                        stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                        sectionStoreEnds: {
                            Featured: isoDate
                        },
                        dailyStoreEnd: isoDate
                    }
                }],
                cacheExpire: isoDate
            }
        },
        eventsTimeOffsetHrs: 0,
        cacheIntervalMins: 10,
        currentTime: new Date().toISOString()
    });
});

module.exports = express