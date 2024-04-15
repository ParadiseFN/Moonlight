const jwt = require("jsonwebtoken");

async function getUser(req, res, next) {
  if (!req.headers["authorization"]) {
    return res.status(401).end();
  }

  let token = req.headers["authorization"].replace("bearer ", "");
  let decodedToken = jwt.decode(token);

  if (decodedToken) {
    req.user = await User.findOne({ email: decodedToken.email });
    if (!bcrypt.compare(decodedToken.password, req.user.password))
      return res.status(403).end();
  }
  next();
}

function getVersion(req) {
  let ver = { season: 0, build: 0.0, CL: "0", lobby: "" };

  if (req && req.headers && req.headers["user-agent"]) {
    let CL = "";
    let userAgentParts = req.headers["user-agent"].split("-");
    CL = userAgentParts[userAgentParts.length - 1].split(" ")[0].split(",")[0];

    let buildIndex = req.headers["user-agent"].indexOf("Release-");
    if (buildIndex !== -1) {
      let build = req.headers["user-agent"]
        .substring(buildIndex + 8)
        .split("-")[0];
      let buildP = build.split(".");
      ver.season = parseInt(buildP[0]);
      ver.build = parseFloat(`${buildP[0]}.${buildP[1]}${buildP[2]}`);
      ver.CL = CL;
      ver.lobby = `LobbySeason${ver.season}`;
    }
  }
  return ver;
}

const contentpages = (req) => {
  const ver = getVersion(req);
  const c = require("../../../local/resources/c.json");

  try {
    c.dynamicbackgrounds.backgrounds.backgrounds[0].stage = `season${ver.season}`;
    c.dynamicbackgrounds.backgrounds.backgrounds[1].stage = `season${ver.season}`;
    c.emergencynotice.news.messages[0].title = `Moonlight ${ver.build}`;
    c.emergencynotice.news.messages[0].body = `Welcome to Moonlight Season ${ver.season}`;
  } catch (error) {
    console.error("Error in contentpages function:", error);
  }

  return c;
};

const createError = (
  errorCode,
  errorMessage,
  messageVars,
  numericErrorCode,
  error,
  statusCode,
  res
) => {
  if (res) {
    res.set({
      "X-Epic-Error-Name": errorCode,
      "X-Epic-Error-Code": numericErrorCode,
    });

    res.status(statusCode).json({
      errorCode: errorCode,
      errorMessage: errorMessage,
      messageVars: messageVars,
      numericErrorCode: numericErrorCode,
      originatingService: "any",
      intent: "prod",
      error_description: errorMessage,
      error: error,
    });
  } else {
    // idk yet
  }
};

module.exports = {
  getVersion,
  contentpages,
  createError,
  getUser,
};
