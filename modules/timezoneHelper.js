const timezoneCodes = require("../objects/timezoneCodes");
const axios = require("axios");

const geocodeUrlBase = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}`;
const timezoneUrlBase = `https://maps.googleapis.com/maps/api/timezone/json?key=${process.env.GOOGLE_API_KEY}`;

exports.timezoneFromLocation = async function(location) {
  if (!location) return null;
  location = location
    .replace(/[<>[\]()]/gi, "")// eslint-disable-next-line
    .replace(/[_　]+/gi, " ");
  const timezoneCodeLocationData = exports.timezoneCodeToLocationData(location);
  if (timezoneCodeLocationData) {
    return timezoneCodeLocationData;
  }

  try {
    const foundLatLon = await axios
      .get(`${geocodeUrlBase}&address=${location}`)
      .then((res) => {
        try {
          return res.data.results[0].geometry.location;
        } catch (e) {
          return null;
        }
      })
      .catch((e) => console.log(e));
    if (!foundLatLon) {
      return null;
    }
    const foundTimezone = await axios
      .get(
        `${timezoneUrlBase}&location=${foundLatLon.lat},${foundLatLon.lng}&timestamp=${Date.now() / 1000}`,
      )
      .then((res) => res.data)
      .catch((e) => console.log(e));
    if (foundTimezone.status === "OK") {
      return {
        timezoneName: exports.standardizeTimezoneName(
          foundTimezone.timeZoneName,
        ),
        location: foundTimezone.timeZoneId,
        dstOffset: Math.round(foundTimezone.dstOffset/360) / 10,
        //convert seconds into hours and round to nearest 1 decimal places (for 0.5)
        utcOffset: Math.round(foundTimezone.rawOffset/360) / 10,
      };
    }
    return null;
  } catch (e) {
    console.log("Google API get error:", e);
    return null;
  }
};

exports.timezoneCodeToLocationData = function(location) {
  if (!location) return;

  location = location // eslint-disable-next-line
    .replace(/[<>\[\]()]/gi, ``) // eslint-disable-next-line
    .replace(/[_　]/gi, ` `)
    .replace(/@!?\d* */gi, "");

  // check for UTC command
  const UTCMatch = /^(?:UTC|GMT) ?(\+|-)? ?(\d*)? ?(:30)?/gi.exec(
    location,
  );
  if (UTCMatch) {
    let offset = 0;
    if (UTCMatch[2]) {
      offset = parseInt(UTCMatch[2]);
      if (UTCMatch[3]) {
        offset += 0.5;
      }
    }
    if (UTCMatch[1] === "-") {
      offset = -offset;
    }
    if (offset > 14 || offset < -12) return;

    return {
      timezoneName: `UTC${
        offset > 0 ? "+" + offset : offset
      }`,
      location: `Etc/GMT${
        offset > 0 ? "+" + offset : offset
      }`,
      dstOffset: null,
      utcOffset: offset,
    };
  }

  // check for literal timezone code
  const timezoneCodeName = location
    .replace(/\s*/g, "")
    .toUpperCase();
  const foundTimezoneCode = timezoneCodes[timezoneCodeName];
  if (foundTimezoneCode !== undefined) {
    return {
      timezoneName: timezoneCodeName,
      location: `Etc/GMT${
        foundTimezoneCode >= 0 ? "+" : ""
      }${foundTimezoneCode}`,
      dstOffset: null,
      utcOffset: foundTimezoneCode,
    };
  }
};

exports.standardizeTimezoneName = function(name) {
  return name.replace(
    /(Standard |Daylight |Summer |Winter |Spring |Fall )/gi,
    "",
  );
};