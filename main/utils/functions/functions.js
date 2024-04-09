const jwt = require('jsonwebtoken');

async function getUser(req, res, next) {
    if (!req.headers["authorization"]) {
        return res.status(401).end();
    }
  
    let token = req.headers["authorization"].replace("bearer ", "");
    let decodedToken = jwt.decode(token);
  
    if (decodedToken) {
        req.user = await User.findOne({ email: decodedToken.email });
        if (!bcrypt.compare(decodedToken.password, req.user.password)) return res.status(403).end();
    }
    next();
  }
  
  
const getVersion = (req) => {
    let memory = {
        season: 0,
        build: 0.0,
        CL: "0",
        lobby: ""
    };
    if (req && req.headers && req.headers["user-agent"]) {
        let CL = "";
        try {
            let BuildID = req.headers["user-agent"].split("-")[3].split(",")[0];
            if (!Number.isNaN(Number(BuildID)))
                CL = BuildID;
            else {
                BuildID = req.headers["user-agent"].split("-")[3].split(" ")[0];
                if (!Number.isNaN(Number(BuildID)))
                    CL = BuildID;
            }
        }
        catch {
            try {
                let BuildID = req.headers["user-agent"].split("-")[1].split("+")[0];
                if (!Number.isNaN(Number(BuildID)))
                    CL = BuildID;
            }
            catch { }
        }
        try {
            let Build = req.headers["user-agent"].split("Release-")[1].split("-")[0];
            if (Build.split(".").length == 3) {
                let Value = Build.split(".");
                Build = Value[0] + "." + Value[1] + Value[2];
            }
            memory.season = Number(Build.split(".")[0]);
            memory.build = Number(Build);
            memory.CL = CL;
            memory.lobby = `LobbySeason${memory.season}`;
            if (Number.isNaN(memory.season))
                throw new Error();
        }
        catch (e) {
            if (Number.isNaN(memory.CL)) {
                memory.season = 0;
                memory.build = 0.0;
                memory.CL = CL;
                memory.lobby = "LobbySeason0";
            }
            else if (Number(memory.CL) < 3724489) {
                memory.season = 0;
                memory.build = 0.0;
                memory.CL = CL;
                memory.lobby = "LobbySeason0";
            }
            else if (Number(memory.CL) <= 3790078) {
                memory.season = 1;
                memory.build = 1.0;
                memory.CL = CL;
                memory.lobby = "LobbySeason1";
            }
            else {
                memory.season = 2;
                memory.build = 2.0;
                memory.CL = CL;
                memory.lobby = "LobbyWinterDecor";
            }
        }
    }
    return memory;
};

const contentpages = (req) => {
    const ver = getVersion(req);
    const c = require("../../../local/resources/c.json");

    try {
        c.dynamicbackgrounds.backgrounds.backgrounds[0].stage = `season${ver.season}`;
        c.dynamicbackgrounds.backgrounds.backgrounds[1].stage = `season${ver.season}`;
        c.emergencynotice.news.messages[0].title = `Moonlight ${ver.build}`;
        c.emergencynotice.news.messages[0].body = `Welcome to Moonlight Season ${ver.season}`;


        if (ver.season == 10) {
            c.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "seasonx";
            c.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "seasonx";
        }

        if (ver.build == 11.31 || ver.build == 11.40) {
            c.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "Winter19";
            c.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "Winter19";
        }

        if (ver.build == 19.01) {
            c.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "winter2021";
            c.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn.discordapp.com/attachments/927739901540188200/930880158167085116/t-bp19-lobby-xmas-2048x1024-f85d2684b4af.png";
            c.subgameinfo.battleroyale.image = "https://cdn.discordapp.com/attachments/927739901540188200/930880421514846268/19br-wf-subgame-select-512x1024-16d8bb0f218f.jpg";
            c.specialoffervideo.bSpecialOfferEnabled = true; 
        }

        if (ver.season == 20) {
            if (ver.build == 20.40) {
                c.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-40-armadillo-glowup-lobby-2048x2048-2048x2048-3b83b887cc7f.jpg";
            } else {
                c.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/t-bp20-lobby-2048x1024-d89eb522746c.png";
            }
        }

        if (ver.season == 21) {
            c.dynamicbackgrounds.backgrounds.backgrounds[0].backgroundimage = "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg";
        }
    } catch (error) {
        console.error("Error in contentpages function:", error);
    }
    
    return c;
}

const createError = (errorCode, errorMessage, messageVars, numericErrorCode, error, statusCode, res) => {
    if (res) {
        res.set({
            'X-Epic-Error-Name': errorCode,
            'X-Epic-Error-Code': numericErrorCode
        });

        res.status(statusCode).json({
            errorCode: errorCode,
            errorMessage: errorMessage,
            messageVars: messageVars,
            numericErrorCode: numericErrorCode,
            originatingService: "any",
            intent: "prod",
            error_description: errorMessage,
            error: error
        });
    } else {
        // idk yet
    }
};

module.exports = {
    getVersion,
    contentpages,
    createError, 
    getUser
};
